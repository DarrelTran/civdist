import {useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import common from './common.module.css';
import styles from './signUpPage.module.css';
import { TITLE_CHAR_ANIM_DELAY_MS, TITLE_CHAR_ANIM_TIME_MS, TITLE_TEXT } from '../utils/constants';
import Marquee from '../components/marquee/marquee';
import { backend_createUser, backend_loginUser } from '../REST/user';
import { easySetTimeout } from '../utils/misc/misc';

const SignUpPage = () => 
{
    const nav = useNavigate();

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const [errorText, setErrorText] = useState<string>('');
    const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    return (
        <div className={common.body}>
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

                <span style={{display: 'block', margin: '0 auto'}} className={common.errorText}>{errorText}</span>
            </div>
        </div>
    );

    async function handleSignUp()
    {
        // check here since backend does not check for the confirmation password
        if (password.length === 0 || confirmPassword.length === 0)
        {
            easySetTimeout<string>
            (
                setErrorText, 
                errorTimeoutRef, 
                `Username or password cannot be empty!`,
                '',
                4000
            );
            return;
        }

        if (password !== confirmPassword && password.length > 0 && confirmPassword.length > 0)
        {
            easySetTimeout<string>
            (
                setErrorText, 
                errorTimeoutRef, 
                `Password does not match!`,
                '',
                4000
            );
            return;
        }

        const signUpResponse = await backend_createUser(username, password);

        switch(signUpResponse.status)
        {
            case 409:
                easySetTimeout<string>
                (
                    setErrorText, 
                    errorTimeoutRef, 
                    `User ${username} already exists!`,
                    '',
                    4000
                );
                return;
            case 411:
                easySetTimeout<string>
                (
                    setErrorText, 
                    errorTimeoutRef, 
                    `Username or password cannot be empty!`,
                    '',
                    4000
                );
                return;
            case 422:
                easySetTimeout<string>
                (
                    setErrorText, 
                    errorTimeoutRef, 
                    `Type validation error (422).`,
                    '',
                    4000
                );
                return;
            case 500:
                easySetTimeout<string>
                (
                    setErrorText, 
                    errorTimeoutRef, 
                    `Something went wrong (500).`,
                    '',
                    4000
                );
                return;
        }

        const loginResponse = await backend_loginUser(username, password);

        switch(loginResponse.status)
        {
            case 400:
                easySetTimeout<string>
                (
                    setErrorText, 
                    errorTimeoutRef, 
                    `Invalid username or password!`,
                    '',
                    4000
                );
                return;
            case 404:
                easySetTimeout<string>
                (
                    setErrorText, 
                    errorTimeoutRef, 
                    `User ${username} does not exist!`,
                    '',
                    4000
                );
                return;
            case 409:
                easySetTimeout<string>
                (
                    setErrorText, 
                    errorTimeoutRef, 
                    `User ${username} already exists!`,
                    '',
                    4000
                );
                return;
            case 411:
                easySetTimeout<string>
                (
                    setErrorText, 
                    errorTimeoutRef, 
                    `Username or password cannot be empty!`,
                    '',
                    4000
                );
                return;
            case 422:
                easySetTimeout<string>
                (
                    setErrorText, 
                    errorTimeoutRef, 
                    `Type validation error (422).`,
                    '',
                    4000
                );
                return;
            case 500:
                easySetTimeout<string>
                (
                    setErrorText, 
                    errorTimeoutRef, 
                    `Something went wrong (500).`,
                    '',
                    4000
                );
                return;
        }

        nav('/map');
    }
};

export default SignUpPage;