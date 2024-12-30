import React, { useState } from 'react';
import './style/login-register.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const LoginComp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar()

    const handleUserLogin = (e) => {
        e.preventDefault(); // Prevent default form submission
        const data = {
            username,
            password
        };
        axios.post('https://blabspace-backend.onrender.com/user/login', data)
            .then((res) => {
                window.localStorage.setItem("isToken", res.data.token)

                enqueueSnackbar(res.data.message, { variant: 'success' })
                setTimeout(()=>{
                    window.location.href = "/"
                }, 1000)
            })
            .catch((error) => {
                enqueueSnackbar("Error", { varient : 'error' })
                console.log(error);
            });
    };

    return (
        <>
            <div className='container'>
                <div className="center">
                    <h1 className='logreg-title'>Login</h1>
                    <form className='login-form' onSubmit={handleUserLogin}>
                        <input type="text" name='username' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} /><br />
                        <input type="password" name='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} /><br/>
                        <button className='login-btn' type="submit">Login</button>
                    </form>
                    <div className='links'>
                        <a className="forgot-text">Forgot password?</a><br/>
                        New here? <a className="register-text" href="/register">Create account now!</a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginComp;