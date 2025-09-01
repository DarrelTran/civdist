import { useNavigate } from 'react-router-dom';
import styles from './homePage.module.css';
import common from './common.module.css';
import Marquee from '../components/marquee/marquee';
import { TITLE_CHAR_ANIM_DELAY_MS, TITLE_CHAR_ANIM_TIME_MS, TITLE_TEXT } from '../utils/constants';
import titleImg from '../images/title.png'
import { backend_logout } from '../REST/user';
import { useMessage } from '../hooks/useMessage';
import { useState } from 'react';
import Overlay from '../components/overlay/overlay';

const HomePage = () => 
{
    const nav = useNavigate();
    const loggedIn = sessionStorage.getItem('loggedIn');

    const 
    {
        message: miscMessage,
        showError: showMiscError,
    } = useMessage();

    async function handleLogout()
    {
        const response = await backend_logout();

        if (response.status !== 204)
        {
            showMiscError(`Log out attempt failed (${response.status}).`);
        }
        else
        {
            sessionStorage.setItem('loggedIn', 'false');
        }

        showMiscError(''); // lazy way to re-render
    }

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

            <img src={titleImg} alt='civdist map preview' className={styles.titleImg}/>

            <div className={styles.titleOptions}>
                <button 
                    className={common.smallButton} 
                    onClick={handleLogout}
                    style={{display: loggedIn === 'true' ? 'block' : 'none'}}
                >
                    Log Out
                </button>

                <button 
                    className={common.smallButton} 
                    onClick={e => nav('/signup')} 
                    style={{display: loggedIn === 'true' ? 'none' : 'block'}}
                >
                    Sign Up
                </button>

                <button 
                    className={common.smallButton} 
                    onClick={e => nav('/login')} 
                    style={{display: loggedIn === 'true' ? 'none' : 'block'}}
                >
                    Login
                </button>

                <button 
                    className={common.smallButton} 
                    onClick={e => nav('/map')}
                >
                    Create A New Map
                </button>

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
};

export default HomePage;