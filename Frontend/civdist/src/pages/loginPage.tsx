import {useState, useRef} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import common from './common.module.css';
import styles from './loginPage.module.css';
import { TITLE_CHAR_ANIM_DELAY_MS, TITLE_CHAR_ANIM_TIME_MS, TITLE_TEXT } from '../utils/constants';
import Marquee from '../components/marquee/marquee';
import { backend_loginUser } from '../REST/user';
import { easySetTimeout } from '../utils/misc/misc';
import { useCheckLoggedIn } from '../hooks/checkLoggedIn';

const LoginPage = () => 
{
    const nav = useNavigate()

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [errorText, setErrorText] = useState<string>('');
    const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useCheckLoggedIn('/map');

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

                <span style={{display: 'block', margin: '0 auto'}} className={common.errorText}>{errorText}</span>
            </div>
        </div>
    );

    async function handleLogin()
    {
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

export default LoginPage;