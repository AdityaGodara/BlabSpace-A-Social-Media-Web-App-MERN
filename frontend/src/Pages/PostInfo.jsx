import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { enqueueSnackbar } from 'notistack'
import { useParams, useNavigate, Link } from 'react-router-dom'
import '../Components/style/postinfo.css'

import Footer from '../Components/Footer'

import Header from '../Components/Header'

const PostInfo = () => {
    const [post, setPost] = useState(null)
    const [gangInfo, setGangInfo] = useState(null)
    const [userGang, setUserGang] = useState(null)
    const [userdata, setUserData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [comment, setComment] = useState('')
    const navigate = useNavigate()

    const { id } = useParams()
    const token = window.localStorage.getItem('isToken')

    useEffect(() => {
        const fetchPostInfo = async () => {
            try {
                const res = await axios.get(`https://blabspace-backend.onrender.com/post/info/${id}`)
                setPost(res.data.data)
                if (res.data.data.gangID) {
                    try {
                        const gid = res.data.data.gangID;
                        const g_res = await axios.get(`https://blabspace-backend.onrender.com/gang/info/${gid}`);
                        setGangInfo(g_res.data.data);
                    } catch (error) {
                        console.log("Error fetching gang info:", error);
                        enqueueSnackbar("Failed to fetch gang info", { variant: 'error' });
                    }
                }
            } catch (error) {
                console.log("Error fetching post info:", error)
                enqueueSnackbar("Failed to fetch post info", { variant: 'error' })
            } finally {
                setIsLoading(false);
            }
        }

        const fetchUserData = async () => {
            if (token) {
                try {
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
                                setUserGang(res.data.data);
                            }
                            catch(error){
                                console.log(error)
                                enqueueSnackbar("Failed to fetch gang info", { varient: 'error' })
                            }
                        }
                    }
                } catch (error) {
                    console.log(error)
                    enqueueSnackbar(error.message, { variant: 'error' })
                }
            }
        }

        fetchUserData()
        fetchPostInfo()
    }, [id, token])

    if (isLoading || !post) {
        return <p>LOADING POST...</p>
    }

    const handleAddComment = async (pid) => {
        try {
            const data = {
                uname: userdata.username,
                txt: comment,
                gname: userGang.name
            }
            const addComm = await axios.put(`https://blabspace-backend.onrender.com/post/add-comment/${pid}`, data)
            if (addComm.data.message) {
                enqueueSnackbar(addComm.data.message, { varient: 'success' })
                console.log(addComm.data.message)
                setTimeout(() => {
                    window.location.reload()
                }, 500)
            }

        } catch (error) {
            console.log(error)
            enqueueSnackbar(error.message, { varient: 'error' })
        }
    }


    return (
        <>
            <Header />
            <button className="pi-back-btn" onClick={() => navigate('/your-space')}>&#8592; back</button>
            {gangInfo && (
                <>
                <Link to={`/gang/info/${gangInfo._id}`}>
                <div className="pi-gangInfo">
                    <span className='pi-gangname'>{gangInfo.name}</span>
                    <span className='pi-gangsign'>{gangInfo.gangsign}</span>
                </div>
                </Link>
                </>
            )}

            <div className="pi-post-section">
                <div className="pi-post-container">
                    <div className="pi-post-card" key="1">
                        <div className="pi-post-top">
                            <h2 className="pi-post-title">{post.post_title}</h2>
                            <p className='pi-post-date'>{post.createdAt.slice(0, 10)}</p>
                        </div>
                        <p className="pi-post-username">
                            <img src={post.pfp} className='post-pfp' alt="Profile" />
                            <span className="post-uname"> @{post.uname}</span>
                            {post.byLeader && <img src="/Images/leader.jpg" alt="Leader" className="leader-icon" />}
                        </p>
                        <p className="pi-post-body">{post.post_desc}</p>
                        <div className="pi-comment-section">
                            <div className="pi-comment-icon-container">
                                <button className="material-symbols-outlined" id="cmt-icon">
                                    comment
                                </button>
                                <span className='pi-comm-length'>{post.comments.length}</span>
                            </div>
                            <form className="pi-comment-form" onSubmit={(e) => { e.preventDefault(); handleAddComment(post._id); }}>
                                <input
                                    type="text"
                                    placeholder='Add comment...'
                                    className='pi-comment-box'
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                />
                                <button className="material-symbols-outlined" id="send-icon" type="submit">
                                    send
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="pi-comment-area">
                        {post.comments.length > 0 ? (
                            post.comments.slice(0).reverse().map((comm, commIndex) => (
                                <p className='pi-comment' key={commIndex}>
                                                <span className="pi-comm-uname">@{comm.username}</span><span className='pi-comm-gangname'> ( {comm.gangName} )</span> : <span className="pi-comm-txt">{comm.txt}</span>
                                            </p>
                            ))
                        ) : (
                            <p className='pi-comment'>
                                <span className="pi-comm-uname">No Comments</span>
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default PostInfo