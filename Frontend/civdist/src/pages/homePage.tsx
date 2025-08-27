import React, {use, useEffect, useState, useRef} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './homePage.module.css';
import common from './common.module.css';
import { backend_createUser, backend_deleteUser, backend_loginUser } from '../REST/user';
import Marquee from '../components/marquee';
import { TITLE_CHAR_ANIM_DELAY_MS, TITLE_CHAR_ANIM_TIME_MS, TITLE_TEXT } from '../utils/constants';


const HomePage = () => 
{
    const nav = useNavigate();

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

            <div className={styles.titleOptions}>
                <button className={common.smallButton} onClick={e => nav('/signup')}>Sign Up</button>
                <button className={common.smallButton} onClick={e => nav('/login')}>Login</button>
                <button className={common.smallButton} onClick={e => nav('/map')}>Create A New Map</button>
            </div>

            <button onClick={() => {nav('/map')}}>NEW MAP</button>
            <button 
                onClick=
                {() => 
                    {
                        const res = backend_createUser('test', 'test')
                        console.log(res)
                    }
                }
            >
                TEST API
                </button>
        </div>
    );
};

export default HomePage;