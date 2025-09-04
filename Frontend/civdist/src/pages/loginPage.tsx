import {useState, useRef, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import common from './common.module.css';
import styles from './loginPage.module.css';
import { TITLE_CHAR_ANIM_DELAY_MS, TITLE_CHAR_ANIM_TIME_MS, TITLE_TEXT } from '../utils/constants';
import Marquee from '../components/marquee/marquee';
import { backend_loginUser } from '../REST/user';
import { useMessage } from '../hooks/useMessage';
import Overlay from '../components/overlay/overlay';

const LoginPage = () => 
{
    const 
    {
        message: miscMessage,
        showError: showMiscError,
    } = useMessage();

    const nav = useNavigate()

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

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

            <div className={styles.loginDiv}>
                <span className={styles.loginText}>Username: </span>
                <input value={username} onChange={e => setUsername(e.target.value)} className={common.smallButton} type='text'></input>

                <br/>
                
                <span className={styles.loginText}>Password: </span>
                <input value={password} onChange={e => setPassword(e.target.value)} className={common.smallButton} type='password'></input>

                <br/>

                <button onClick={handleLogin} className={`${common.smallButton} ${styles.loginButton}`}>LOGIN</button>

                <br/>

                <div className={styles.registerDiv}>
                    <span>Don't have an account? </span><Link to={'/signup'} style={{fontWeight: 'bold'}}>Click here to register!</Link>
                </div>

                <br/>

                <div style={{margin: '0 auto'}}>
                    <button className={`${common.smallButton} ${styles.returnButton}`} onClick={e => nav('/')}>RETURN</button>
                </div>

                {
                    miscMessage && 
                    (
                        <span className={miscMessage.type === 'error' ? common.errorText : common.successText} style={{margin: '0 auto', display: 'block'}}>
                            {miscMessage.text}
                        </span>
                    )
                }
            </div>
        </div>
    );

    async function handleLogin()
    {
        try
        {
            setIsLogginIn(true);
            const loginResponse = await backend_loginUser(username, password);
            console.log(JSON.stringify(loginResponse) + ' where status is ' + loginResponse.status);

            if (!loginResponse.status || (loginResponse.status && loginResponse.status !== 201))
                throw loginResponse.status ? loginResponse.status : null;

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
                    break;
                case 404:
                    showMiscError(`User ${username} does not exist!`);
                    setIsLogginIn(false);
                    break;
                case 409:
                    showMiscError(`User ${username} already exists!`);
                    setIsLogginIn(false);
                    break;
                case 411:
                    showMiscError(`Username or password cannot be empty!`);
                    setIsLogginIn(false);
                    break;
                case 422:
                    showMiscError(`Username or password cannot be empty!`);
                    setIsLogginIn(false);
                    break;
            }

            // non specific errors
            if (err && err !== 201)
            {
                showMiscError(`Something went wrong (${err}).`);
                setIsLogginIn(false);
            }
            else if (!err)
            {
                showMiscError('Something went wrong. This should not have happened.');
                setIsLogginIn(false);
            }
        }
    }
};

export default LoginPage;