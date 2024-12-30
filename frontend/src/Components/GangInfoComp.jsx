import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './style/ganginfo.css'
import { enqueueSnackbar } from 'notistack'

const GangInfoComp = () => {
    const [gangInfo, setGangInfo] = useState(null)
    const [userdata, setUserData] = useState(null)
    const { id } = useParams()
    const navigate = useNavigate()
    const token = window.localStorage.getItem('isToken')
    const [password, setPassword] = useState('')
    const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)

    useEffect(() => {
        const fetchGangInfo = async () => {
            try {
                const res = await axios.get(`https://blabspace-backend.onrender.com/gang/info/${id}`)
                setGangInfo(res.data.data)
            } catch (error) {
                console.log("Error fetching gang info:", error)
                enqueueSnackbar("Failed to fetch gang info", { variant: 'error' })
            }
        }

        const fetchUserData = async () => {
            if (token) {
                try {
                    const response = await axios.get('https://blabspace-backend.onrender.com/user/profile', {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    if (response.data.decoded === "token expired") {
                        enqueueSnackbar("Session expired. Please log in again.", { variant: 'error' })
                        handleLogout()
                    } else {
                        setUserData(response.data.decoded)
                    }
                } catch (error) {
                    console.log(error)
                    enqueueSnackbar("Failed to fetch user data", { variant: 'error' })
                }
            }
        }

        fetchGangInfo()
        fetchUserData()
    }, [id, token, enqueueSnackbar])

    const handleLogout = () => {
        window.localStorage.removeItem('isToken')
        navigate('/login')
    }


    const handleJoinGang = async () => {
        if (!userdata) {
            enqueueSnackbar("Please log in to join a gang", { variant: 'error' })
            return
        }

        setShowPasswordPrompt(true)
    }

    const confirmJoinGang = async () => {
        try {

            const loginData = {
                username: userdata.username,
                password: password
            }
            const loginResponse = await axios.post('https://blabspace-backend.onrender.com/user/login', loginData)

            if (loginResponse.status === 200) {

                const joinResponse = await axios.put(`https://blabspace-backend.onrender.com/gang/new-member/${id}`, { userId: userdata.id })
                enqueueSnackbar(joinResponse.data.message, { variant: 'success' })

                const againLoginResponse = await axios.post('https://blabspace-backend.onrender.com/user/login', loginData)

                window.localStorage.setItem("isToken", againLoginResponse.data.token)
                enqueueSnackbar("Successfully joined the gang and logged in", { variant: 'success' })

                setShowPasswordPrompt(false)
                setPassword('')

                setTimeout(() => {
                    navigate('/')
                }, 1000)

            }

            
        } catch (error) {
            console.log(error)
            enqueueSnackbar(error.response?.data?.message || "Error joining gang", { variant: 'error' })
        }
    }

    if (!gangInfo) {
        return <p>Loading gang information...</p>
    }

    return (
        <>
            <button className="ginfo-backbtn" onClick={() => navigate('/')}>&#8592; back</button>
            <div className='ginfo-container'>
                <div className="ginfo-content">
                    <div className="ginfo-header">
                        <div className="ginfo-name-sign">
                            <span className="ginfo-name">{gangInfo.name}</span>
                            <span className="ginfo-sign">{gangInfo.gangsign}</span>
                        </div>
                        <h3 className="ginfo-tagline"># {gangInfo.tagline}</h3>
                    </div>
                    <div className="description">
                        &#10097; <span className='desc-text'>Description</span>
                        <p className="desc">{gangInfo.description}</p>
                        <p className="ginfo-memcount">Members: {gangInfo.members?.length || 0}</p>
                    </div>
                    {userdata && !userdata.gang_id && (
                        <button className="ginfo-joinbtn" onClick={handleJoinGang}>JOIN</button>
                    )}
                    {showPasswordPrompt && (
                        <div className="password-prompt">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className='conf-pass'
                                required='true'
                            />
                            <button onClick={confirmJoinGang} className='conf-btn'>Confirm Join</button>
                        </div>
                    )}
                </div>
                <div className="gang-stamp-container">
                    <img src={gangInfo.logo} alt="" className="gang-stamp" />
                </div>
            </div>

        </>
    )
}

export default GangInfoComp