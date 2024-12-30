import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import './style/yourgang.css'
import { enqueueSnackbar } from 'notistack'
import GangList from './GangList'
import NewPost from './NewPost'

const YourGangComp = () => {

    const [gangInfo, setGangInfo] = useState(null)
    const [userdata, setUserData] = useState(null)
    const navigate = useNavigate()
    const token = window.localStorage.getItem('isToken')
    const [password, setPassword] = useState('')
    const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [commentVisibility, setCommentVisibility] = useState({});
    const [comment, setComment] = useState('')

    useEffect(() => {

        const fetchUserData = async () => {
            if (token) {
                try {
                    setIsLoading(true);
                    const response = await axios.get('https://blabspace-backend.onrender.com/user/profile', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (response.data.decoded === "token expired") {
                        enqueueSnackbar("Session expired. Please log in again.", { variant: 'error' });
                        handleLogout();
                    } else {
                        setUserData(response.data.decoded);

                        if (response.data.decoded.gang_id) {
                            try {
                                const id = response.data.decoded.gang_id;
                                const res = await axios.get(`https://blabspace-backend.onrender.com/gang/info/${id}`);
                                setGangInfo(res.data.data);

                                const p_res = await axios.post(`https://blabspace-backend.onrender.com/post/${id}`);
                                setPosts(p_res.data.data);
                            } catch (error) {
                                console.log("Error fetching gang info:", error);
                                enqueueSnackbar("Failed to fetch gang info", { variant: 'error' });
                            }
                        }
                    }
                } catch (error) {
                    console.log(error);
                    enqueueSnackbar("Failed to fetch user data", { variant: 'error' });
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        // if (gangInfo) {
        //     fetchMemberNames()
        // }

        fetchUserData()

    }, [token, enqueueSnackbar])

    const handleLogout = () => {
        window.localStorage.removeItem('isToken')
        navigate('/login')
    }

    const handleLeaveGang = async () => {
        if (!userdata) {
            enqueueSnackbar("Please log in to Leave a gang", { variant: 'error' })
            return
        }

        setShowPasswordPrompt(true)
    }

    const confirmLeaveGang = async () => {
        try {

            const loginData = {
                username: userdata.username,
                password: password
            }
            const loginResponse = await axios.post('https://blabspace-backend.onrender.com/user/login', loginData)

            if (loginResponse.status === 200) {

                const joinResponse = await axios.put(`https://blabspace-backend.onrender.com/gang/leave-gang/${gangInfo._id}`, { userId: userdata.id })
                enqueueSnackbar(joinResponse.data.message, { variant: 'success' })

                const againLoginResponse = await axios.post('https://blabspace-backend.onrender.com/user/login', loginData)

                window.localStorage.setItem("isToken", againLoginResponse.data.token)
                enqueueSnackbar("Successfully left the gang and logged in", { variant: 'success' })

                setShowPasswordPrompt(false)
                setPassword('')

                setTimeout(() => {
                    navigate('/')
                }, 1000)

            }


        } catch (error) {
            console.log(error)
            enqueueSnackbar(error.response?.data?.message || "Error Leaving gang", { variant: 'error' })
        }
    }

    const handleDltPost = async (pid) => {
        try {

            const delRes = await axios.delete(`https://blabspace-backend.onrender.com/post/delete/${pid}`)
            if (delRes.data.message) {
                enqueueSnackbar(delRes.data.message, { varient: 'success' })
                setTimeout(() => {
                    window.location.href = "/your-space"
                }, 500)
            }

        } catch (error) {
            console.log(error.message)
            enqueueSnackbar(error.message, { varient: 'error' })
        }
    }

    const handleAddComment = async (pid) => {
        try {
            const data = {
                uname: userdata.username,
                txt: comment,
                gname: gangInfo.name
            }
            const addComm = await axios.put(`https://blabspace-backend.onrender.com/post/add-comment/${pid}`, data)
            if (addComm.data.message) {
                enqueueSnackbar(addComm.data.message, { varient: 'success' })
                console.log(addComm.data.message)
                setTimeout(() => {
                    window.location.href = "/your-space"
                }, 500)
            }

        } catch (error) {
            console.log(error)
            enqueueSnackbar(error.message, { varient: 'error' })
        }
    }

    const copyUrlToClipboard = (post_id) => {
        const currentUrl = window.location.href;
        const rootUrl = currentUrl.split('/').slice(0, 3).join('/');
        const posturl = `/post/info/${post_id}`

        navigator.clipboard.writeText(rootUrl + posturl)
            .then(() => {
                enqueueSnackbar("Link copied to clipboard!", { variant: 'success' });
            })
            .catch((error) => {
                console.error("Failed to copy URL: ", error);
                enqueueSnackbar("Failed to copy URL", { variant: 'error' });
            });
    };

    return (
        <div className="yg-container">
            {isLoading ? (
                <div>Loading...</div>
            ) : userdata && userdata.gang_id && gangInfo ? (
                <>
                    <button className="yg-back-btn" onClick={() => navigate('/')}>&#8592; back</button>
                    <div className='yg-content'>
                        <div className="yg-post-section">
                            <NewPost />
                            <hr />
                            <h1 className='yg-post-header'>Posts: </h1>
                            {posts.length != 0 && posts.slice(0).reverse().map((post, index) => (
                                <div className="yg-post-card" key={index}>
                                    <div className="yg-post-top">
                                        <Link to={`/post/info/${post._id}`} className='post-head-link'>
                                            <h2 className="yg-post-title">{post.post_title}</h2>
                                        </Link>
                                        <p className='yg-post-date'>{post.createdAt.slice(0, 10)}</p>
                                    </div>
                                    <p className="yg-post-username"><img src={post.pfp} className='post-pfp' /><span className="post-uname"> @{post.uname}</span>
                                        {
                                            post.byLeader && (
                                                <img src="Images/leader.jpg" alt="" className="leader-icon" />
                                            )
                                        }</p>
                                    <p className="yg-post-body">{post.post_desc}</p>
                                    {
                                        userdata.isLeader && (userdata.gang_id === gangInfo._id) && (
                                            <button className="material-symbols-outlined" id="dlt-icon" onClick={() => handleDltPost(post._id)}>
                                                delete
                                            </button>
                                        )
                                    }

                                    <div className="comment-section">
                                        <div className="comment-actions">
                                            <button
                                                className="material-symbols-outlined"
                                                id="cmt-icon"
                                                onClick={() => {
                                                    setCommentVisibility(prev => ({
                                                        ...prev,
                                                        [post._id]: !prev[post._id]
                                                    }));
                                                }}
                                            >
                                                comment
                                            </button>
                                            <span className="comment-count">{post.comments.length}</span>
                                        </div>
                                        <form className="comment-form" onSubmit={(e) => { e.preventDefault(); handleAddComment(post._id); }}>
                                            <input
                                                type="text"
                                                placeholder='Add comment...'
                                                className='comment-box'
                                                onChange={(e) => setComment(e.target.value)}
                                                required
                                            />
                                            <button className="material-symbols-outlined" id="send-icon" type="submit">
                                                send
                                            </button>
                                        </form>
                                        <button onClick={() => copyUrlToClipboard(post._id)} className='share-btn'>
                                            <span className="material-symbols-outlined">
                                                share
                                            </span>
                                        </button>
                                    </div>

                                    {commentVisibility[post._id] && post.comments.slice(0).reverse().map((comm, commIndex) => (

                                        <p className='comment' key={commIndex}>
                                            <span className="comm-uname">@{comm.username}</span><span className='comm-gangname'> ( {comm.gangName} )</span> : <span className="comm-txt">{comm.txt}</span>
                                        </p>

                                    ))}

                                </div>
                            ))}
                            {
                                posts.length === 0 && (
                                    <div className="no-post">
                                        There is no post on this space.<br />
                                        Be the first to post!
                                    </div>
                                )
                            }
                        </div>

                        <div className="yg-gang-info">
                            <div className="yg-gang-logo">
                                <img src={gangInfo.logo} alt="" className="yg-gang-stamp" />
                            </div>

                            <div className="yg-gang-details">
                                <div className="yg-gang-header">
                                    <div className="yg-gang-title">
                                        <span className="yg-gang-name">{gangInfo.name}</span>
                                        <span className="yg-gang-sign">{gangInfo.gangsign}</span>
                                    </div>
                                    <h3 className="yg-gang-tagline"># {gangInfo.tagline}</h3>
                                </div>
                                <div className="yg-gang-description">
                                    <span className='yg-desc-label'>Description</span>
                                    <p className="yg-desc-text">{gangInfo.description}</p>
                                </div>

                                <p className="yg-member-count">Members: {gangInfo.members?.length || 0}</p>

                                {!userdata.isLeader && (
                                    <button className="yg-leave-btn" onClick={handleLeaveGang}>Leave Space</button>
                                )}

                                {showPasswordPrompt && (
                                    <div className="yg-password-prompt">
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            className='yg-password-input'
                                            required
                                        />
                                        <button onClick={confirmLeaveGang} className='yg-confirm-btn'>Confirm Leave</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className='yg-error'>
                    <p className='error-text'>You may not be in a Space :(</p>
                    <p className="yg-error-subtext">You can join some of these:</p>
                    <GangList />
                </div>
            )}
        </div>
    )
}

export default YourGangComp
