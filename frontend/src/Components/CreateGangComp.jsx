import React, { useState, useEffect } from 'react';
import './style/creategang.css';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateGangComp = () => {
    const [name, setName] = useState('');
    const [tagline, setTagline] = useState('');
    const [gangsign, setGangsign] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [logo, setLogo] = useState('');
    const [userdata, setUserData] = useState('');
    const [token, setToken] = useState(window.localStorage.getItem('isToken'));

    const { enqueueSnackbar } = useSnackbar();

    console.log(`category: ${category}`);

    const fetchUserData = async (currentToken) => {
        if (currentToken) {
            try {
                const response = await axios.get('http://localhost:5555/user/profile', {
                    headers: { Authorization: `Bearer ${currentToken}` },
                });
                if (response.data.decoded === "token expired") {
                    enqueueSnackbar(response.data.decoded, { variant: 'error' });
                    handleLogout();
                } else {
                    setUserData(response.data.decoded);
                }
            } catch (error) {
                console.error(error);
                enqueueSnackbar("Failed to fetch user data", { variant: 'error' });
            }
        }
    };

    useEffect(() => {
        fetchUserData(token);
    }, [token, enqueueSnackbar]);

    const handleCreateGang = async (e) => {
        e.preventDefault();
        const leader = userdata.id;
        console.log(userdata.id);
        const data = {
            name,
            tagline,
            gangsign,
            description,
            logo,
            category,
            leader
        };
        try {
            const response = await axios.post('http://localhost:5555/gang/new-gang', data);
            
            if (response.data.gangId) {
                // Gang created successfully, now logout and login again
                window.localStorage.removeItem('isToken')
                enqueueSnackbar('Gang created successfully', { variant: 'success' });
                enqueueSnackbar("YOU HAVE TO LOGIN AGAIN AFTER CREATING A GANG!")
                window.localStorage.removeItem('isToken')
                setTimeout(()=>{
                    window.location.href ="/login"
                }, 1000)
            }
        } catch (error) {
            console.error(error);
            enqueueSnackbar(error.response?.data?.message || 'Error creating gang', { variant: 'error' });
        }
    };

    return (
        <>
            <div className='container'>
                <div className="center">
                    <h1 className='logreg-title'>Create Space</h1>
                    <form className='gang-form' onSubmit={handleCreateGang}>
                        <input type="text" name='name' placeholder='Gang Name' required onChange={(e) => setName(e.target.value)} /><br />
                        <input type="text" name='tagline' placeholder='Tagline' required onChange={(e) => setTagline(e.target.value)} /><br />
                        <input type="text" name='gangsign' placeholder='A Unique Gang Sign' required onChange={(e) => setGangsign(e.target.value)} /><br />
                        <textarea rows="7" cols="10" name="description" className='gangdesc' placeholder='Gang description...' required onChange={(e) => setDescription(e.target.value)} />

                        <select name="category" className='gang-cat' onChange={(e) => setCategory(e.target.value)}>
                        <option value="">Please Select category</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Education">Education</option>
                            <option value="Art and Music">Art & Music</option>
                            <option value="Explicit">Explicit (18+)</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Politics and Social Issues">Politics and Social Issues</option>
                        </select>

                        {/* Gang Stamp symbol */}
                        <div className='stamp-container'>
                            {[
                                "/Images/stamps/1.jpg",
                                "/Images/stamps/2.jpg",
                                "/Images/stamps/3.jpg",
                                "/Images/stamps/4.jpg",
                                "/Images/stamps/5.jpg",
                                "/Images/stamps/6.jpg",
                                "/Images/stamps/7.jpg",
                                "/Images/stamps/8.jpg",
                                "/Images/stamps/9.jpg",
                                "/Images/stamps/10.jpg",
                                "/Images/stamps/11.jpg",
                                "/Images/stamps/12.jpg"
                            ].map((src, index) => (
                                <label key={index} className="stamp-label">
                                    <input
                                        type='radio'
                                        name='logo'
                                        value={src}
                                        className='radio-btn-stamp'
                                        onChange={(e) => setLogo(e.target.value)}
                                    />
                                    <img src={src} className="stamp-btn" alt={`Stamp ${index + 1}`} />
                                </label>
                            ))}
                        </div>

                        <button className='login-btn' type="submit">Start Gang</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateGangComp;