import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'
import './allPages.css'
import './loginPage.css'

const LoginPage = () => 
{
    const [loginUsername, setLoginUsername] = useState<string>('');
    const [loginPassword, setloginPassword] = useState<string>('');

    return (
        <div>
            <div>
                <form className="forms" onSubmit={e => handleLogin(e)}>
                    <label>
                        Username: <input type="text" value={loginUsername} onChange={u => setLoginUsername(u.target.value)}/>
                    </label>
                    <label>
                        Password: <input type="text" value={loginPassword} onChange={p => setloginPassword(p.target.value)}/>
                    </label>
                    <input id="loginButton" type="submit" value="LOGIN"/>
                </form>
            </div>
            <div id="signUpText">
                Don't have an account? <span><Link to="/signup">Sign Up!</Link></span>
            </div>
        </div>
    );

    async function handleLogin(e: React.FormEvent)
    {
        e.preventDefault();

        await axios.get("http://localhost:5000/login")
        .then(response => 
        {   
            console.log("success")
        })
        .catch(error => 
        {
            console.log(error)
        });
    }
};

export default LoginPage;