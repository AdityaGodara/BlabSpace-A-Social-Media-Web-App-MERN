import React, { useEffect, useState } from 'react'
import './style/profilecard.css'
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { Link } from 'react-router-dom';

const ProfileCard = () => {
    const [userData, setUserData] = useState('')
    const [gangData, setGangData] = useState('')
    const { enqueueSnackbar } = useSnackbar()
    const token = window.localStorage.getItem("isToken")

    useEffect(() => {
        const fetchData = async () => {
            if (token) {
                try {
                    const userResponse = await axios.get('http://localhost:5555/user/profile', {
                        headers: { Authorization: `Bearer ${token}` },
                    })

                    if (userResponse.data.decoded === "token expired") {
                        enqueueSnackbar(userResponse.data.decoded, { variant: 'error' })
                        handleLogout()
                    } else {
                        setUserData(userResponse.data.decoded)

                        if (userResponse.data.decoded.gang_id) {
                            const gangResponse = await axios.get(`http://localhost:5555/gang/info/${userResponse.data.decoded.gang_id}`)
                            setGangData(gangResponse.data.data)
                        }
                    }
                } catch (error) {
                    console.error("Error fetching data:", error)
                    enqueueSnackbar("Failed to fetch user or gang data", { variant: 'error' })
                }
            }
        }

        fetchData()
    }, [token, enqueueSnackbar])

    const handleDeleteProfile = async () => {
        if (!userData) return

        try {
            const res = await axios.delete(`http://localhost:5555/user/delete/${userData.id}`)
            clearLocalStorage();
            enqueueSnackbar(res.data.message, { variant: 'success' })
            setTimeout(() => {
                window.location.href = "/"
            }, 1000)
        } catch (error) {
            enqueueSnackbar("Error deleting profile", { variant: 'error' })
            console.error(error)
        }
    }

    const handleLogout = () => {
        clearLocalStorage();
        enqueueSnackbar("Logged out!", { variant: 'success' })
        setTimeout(() => {
            window.location.href = "/"
        }, 500)
    }

    const clearLocalStorage = () => {
        window.localStorage.removeItem("isToken")
    }

    if (!userData) {
        return <div>Loading...</div>
    }

    return (
        <div className='card-container'>
            <div className='card'>
                <span className="card-name"><img src={userData.avatar} alt="pfp" className='user-pfp' />{userData.name}</span>
                {userData.isLeader && gangData && (
                    <span className='leader-tag'><img src="Images/leader.jpg" alt="leader" className='leader-icon' /></span>
                )}
                <p className="card-uname">@{userData.username}</p>
                <p className="card-gender">{userData.gender}</p>
                {userData.isLeader &&(
                    <p className='card-uname'>The Leader of {gangData.name}</p>
                )}
                <button className="delete-btn" onClick={handleDeleteProfile}>Delete profile</button>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>

            {!userData.gang_id && (
                <div className='gleader-profcard'>
                    <h1 className='not-txt'>Not in any space?</h1>
                    <a href="/gang/new-gang"><button className="create-gang-btn">Become a Space Leader</button></a>
                    <h3 className="or-txt">OR</h3>
                    <Link to={`/gang/all-gangs`}>
                    <button className="join-existing-btn">Join Existing Space</button>
                    </Link>
                </div>
            )}
            {
                userData.gang_id && (
                    <div className='ganginfo-section'>
                        <div className='gang-text-info'>
                            <span className='gang-title-pfcard'>{gangData.name}</span>
                            <span className='tagline'>{gangData.tagline}</span>
                            <a href='/your-space'><button className="ginfo-btn" >Your Space</button></a>
                        </div>
                        <img src={gangData.logo} className='gang-stamp-pfcard' alt="Gang logo" />
                    </div>
                )
            }
        </div>
    )
}

export default ProfileCard