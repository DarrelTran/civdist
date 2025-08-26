import React, {use, useEffect, useState, useRef} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import './homePage.css' 
import './common.css'
import { backend_createUser, backend_deleteUser, backend_loginUser } from '../REST/user';
import Marquee from '../components/marquee';

const CHAR_ANIM_TIME_MS = 500;
const CHAR_ANIM_DELAY_MS = 100;

const TITLE_TEXT = "Civdist";

const HomePage = () => 
{
    const nav = useNavigate();

    const characters = useRef<string[]>(TITLE_TEXT.split(''));

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    return (
        <div>
            <Marquee 
                text={TITLE_TEXT} 
                animTimeMS={500} 
                animTimeDelayMS={100} 
                textDefaultColor='black' 
                textMovingColor={[0, 256]}
                topDivClassName='title'
            />

            <div className='loginDiv'>
                <div>
                    <span className='loginText'>Username: </span>
                    <input value={username} onChange={e => setUsername(e.target.value)} className='smallButton' type='text'></input>
                </div>
                <div>
                    <span style={{marginRight: '5px'}} className='loginText'>Password: </span>
                    <input value={password} onChange={e => setPassword(e.target.value)} className='smallButton' type='password'></input>
                </div>
                <button onClick={handleLogin} className='smallButton loginButton'>LOGIN</button>
                <div className='registerDiv'>
                    <span>Don't have an account? </span><Link to={'/signup'} style={{fontWeight: 'bold'}}>Click here to register!</Link>
                </div>
                <div>
                    <span>OR, start a new map.</span><button onClick={() => {nav('/map')}}>NEW MAP</button>
                </div>
            </div>
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

    function handleLogin()
    {
        const response = backend_loginUser(username, password)
        console.log(response)
    }
};

export default HomePage;