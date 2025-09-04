import {useState, useRef, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import common from './common.module.css';
import styles from './signUpPage.module.css';
import { TITLE_CHAR_ANIM_DELAY_MS, TITLE_CHAR_ANIM_TIME_MS, TITLE_TEXT } from '../utils/constants';
import Marquee from '../components/marquee/marquee';
import { backend_createUser, backend_loginUser } from '../REST/user';
import { useMessage } from '../hooks/useMessage';
import Overlay from '../components/overlay/overlay';

const SignUpPage = () => 
{
    const 
    {
        message: miscMessage,
        showError: showMiscError,
    } = useMessage();

    const nav = useNavigate();

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const [isLoggingIn, setIsLogginIn] = useState<boolean>(false);

    useEffect(() => 
    {
        const handleStorageChange = (event: StorageEvent) =>
        {
            if (event.key === 'loggedIn')
            {
                if (event.newValue === 'true')
                    nav('/map');
            }
        }

        window.addEventListener('storage', handleStorageChange);

        return () =>
        {
            window.removeEventListener('storage', handleStorageChange);
        }         
    }, [])

    return (
        <div className={common.body}>
            <Overlay 
                text='Logging in...'
                overlayStyle={{display: isLoggingIn ? 'flex' : 'none', backgroundColor: 'rgb(0, 0, 0, 0.5)', cursor: 'wait'}}
                textClassName={common.overlayText}
            />

            <Marquee 
                text={TITLE_TEXT} 
                animTimeMS={TITLE_CHAR_ANIM_TIME_MS} 
                animTimeDelayMS={TITLE_CHAR_ANIM_DELAY_MS} 
                textDefaultColor='black' 
                textMovingColor={[0, 256]}
                topDivClassName={common.title}
            />


            <div className={styles.signUpDiv}>
                <span className={styles.signUpText}>Username: </span>
                <input value={username} onChange={e => setUsername(e.target.value.trim())} className={common.smallButton} type='text'></input>

                <br/>

                <span className={styles.signUpText}>Password: </span>
                <input value={password} onChange={e => setPassword(e.target.value.trim())} className={common.smallButton} type='password'></input>

                <br/>
                
                <span className={styles.signUpText}>Confirm Password: </span>
                <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value.trim())} className={common.smallButton} type='password'></input>

                <br/>

                <button onClick={handleSignUp} className={`${common.smallButton} ${styles.signUpButton}`}>SIGN UP</button>

                <br/>

                <div style={{margin: '0 auto'}}>
                    <button className={`${common.smallButton} ${styles.returnButton}`} onClick={e => nav('/')}>RETURN</button>
                </div>

                {
                    miscMessage && 
                    (
                        <span className={miscMessage.type === 'error' ? common.errorText : common.successText}>
                            {miscMessage.text}
                        </span>
                    )
                }
            </div>
        </div>
    );

    async function handleSignUp()
    {
        // check here since backend does not check for the confirmation password
        if (password.length === 0 || confirmPassword.length === 0)
        {
            showMiscError('Username or password cannot be empty!');
            return;
        }

        if (password !== confirmPassword && password.length > 0 && confirmPassword.length > 0)
        {
            showMiscError('Username or password cannot be empty!');
            return;
        }

        try
        {
            const signUpResponse = await backend_createUser(username, password);

            if (!signUpResponse.status || (signUpResponse.status && signUpResponse.status !== 201))
                throw signUpResponse.status;

            try
            {
                setIsLogginIn(true);
                const loginResponse = await backend_loginUser(username, password);

                if (!loginResponse.status || (loginResponse.status && loginResponse.status !== 201))
                    throw loginResponse.status;

                setIsLogginIn(false);
                localStorage.setItem('loggedIn', 'true');
                nav('/map');
            }
            catch (err)
            {
                switch(err)
                {
                    case 400:
                        showMiscError('Invalid username or password!');
                        setIsLogginIn(false);
                        return;
                    case 404:
                        showMiscError(`User ${username} does not exist!`);
                        setIsLogginIn(false);
                        return;
                    case 409:
                        showMiscError(`User ${username} already exists!`);
                        setIsLogginIn(false);
                        return;
                    case 411:
                        showMiscError(`Username or password cannot be empty!`);
                        setIsLogginIn(false);
                        return;
                    case 422:
                        showMiscError(`Username or password cannot be empty!`);
                        setIsLogginIn(false);
                        return;
                }

                // non specific errors
                if (err && err !== 201)
                {
                    showMiscError(`Something went wrong (${err}).`);
                    setIsLogginIn(false);
                    return;
                }
                else if (!err)
                {
                    showMiscError('Something went wrong. This should not have happened');
                    setIsLogginIn(false);
                    return;
                }
            }
        }
        catch (err)
        {
            switch(err)
            {
                case 409:
                    showMiscError(`User ${username} already exists!`);
                    return;
                case 411:
                    showMiscError('Username or password cannot be empty!');
                    return;
            }

            // non specific errors
            if (err && err !== 201)
            {
                showMiscError(`Something went wrong (${err}).`);
                return;
            }
            else if (!err)
            {
                showMiscError('Something went wrong. This should not have happened.');
                return;
            }
        }
    }
};

export default SignUpPage;