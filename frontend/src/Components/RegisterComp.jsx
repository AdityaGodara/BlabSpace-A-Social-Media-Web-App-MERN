import React, { useState } from 'react';
import './style/login-register.css';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack';

const RegisterComp = () => {

    const [name, setName] = useState('')
    const [username, setusername] = useState('')
    const [email, setEmail] = useState('')
    const [gender, setGender] = useState('')
    const [password, setPassword] = useState('')
    const [avatar, setAvatar] = useState('')

    const navigate = useNavigate()
    const { enqueueSnackbar } = useSnackbar()

    const handleUserRegister = (e) => {
        e.preventDefault()
        const data = {
            name,
            username,
            email,
            gender,
            password,
            avatar
        }
        axios.post('http://localhost:5555/user/register', data)
            .then((res) => {
                enqueueSnackbar(res.data.message, { varient: 'success' })
                navigate('/login')
            })
            .catch((error) => {
                enqueueSnackbar("Something went wrong!", { varient: 'error' })
                console.log(error)
            })
    }

    return (
        <div className='container'>
            <div className="center">
                <h1 className='logreg-title'>Register</h1>
                <form className='login-form' onSubmit={handleUserRegister}>
                    <input type="text" name="name" placeholder='Full Name' value={name} onChange={(e) => setName(e.target.value)} required />
                    <input type="email" name="email" placeholder='E-mail' value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <div className="gender-group">
                        <label>Gender:</label>
                        <label>
                            <input type='radio' name='gender' value="Male" onChange={(e) => setGender(e.target.value)} required /> Male
                        </label>
                        <label>
                            <input type='radio' name='gender' value="Female" onChange={(e) => setGender(e.target.value)} required /> Female
                        </label>
                    </div>
                    <input type="text" name='username' placeholder='Username' value={username} onChange={(e) => setusername(e.target.value)} required />
                    <input type="password" name='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />

                    {/* AVATAR SYSTEM */}
                    <div className='pfp-container'>
                        {[
                            "/Images/Avatars/logo.png",
                            "/Images/Avatars/logo-bw.png",
                            "/Images/Avatars/man_with_gun.jpg",
                            "/Images/Avatars/cute_man_with_gun.jpg",
                            "/Images/Avatars/skull_n_girl.jpg",
                            "/Images/Avatars/red_gangster_vector.jpg",
                            "/Images/Avatars/girl.jpg",
                            "/Images/Avatars/red_devil_face.jpg",
                            "/Images/Avatars/blue_logo.jpg",
                            "/Images/Avatars/girl2.jpg"
                        ].map((src, index) => (
                            <label key={index} className="avatar-label">
                                <input
                                    type='radio'
                                    name='avatar'
                                    value={src}
                                    className='radio-btn-pfp'
                                    onChange={(e) => setAvatar(e.target.value)}
                                />
                                <img src={src} className="photo-btn" alt={`Avatar ${index + 1}`} />
                            </label>
                        ))}
                    </div>
                    <button type="submit" className='login-btn'>Register</button>
                </form>
                <div className='links'>
                    Already registered?
                    <a className="register-text" href='/login'>Login here!</a>
                </div>
            </div>
        </div>
    );
}

export default RegisterComp;