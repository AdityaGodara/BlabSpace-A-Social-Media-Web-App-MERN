import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { enqueueSnackbar } from 'notistack'

import './style/newpost.css'

const NewPost = () => {

    const [contentSize, setContentSize] = useState('4')

    const [pTitle, setPTitle] = useState('')
    const [pBody, setPBody] = useState('')
    const token = window.localStorage.getItem('isToken')

    const navigate = useNavigate()


    const handleLogout = () => {
        window.localStorage.removeItem('isToken')
        navigate('/login')
    }

    const handleNewPost = async (e) => {
        e.preventDefault();
        if (token) {
            try {
                const response = await axios.get('https://blabspace-backend.onrender.com/user/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                if (response.data.decoded === "token expired") {
                    enqueueSnackbar("Session expired. Please log in again.", { variant: 'error' })
                    handleLogout()
                } else {
                    const data = {
                        uname: response.data.decoded.username,
                        post_title: pTitle,
                        post_desc: pBody,
                        pfp: response.data.decoded.avatar,
                        gangID: response.data.decoded.gang_id,
                        byLeader: response.data.decoded.isLeader
                    }
                    console.log(data)
                    try {


                        await axios.post('https://blabspace-backend.onrender.com/post/new-post', data)
                            .then((res) => {
                                enqueueSnackbar(res.data.message, { varient: 'success' })
                                setTimeout(()=>{
                                    window.location.href = "/your-space"
                                }, 500)
                            })
                            .catch((error) => {
                                console.log(error.message)
                                enqueueSnackbar(error.message, { varient: 'error' })
                            })

                    } catch (error) {
                        console.log(error.message)
                        enqueueSnackbar(error.message, { varient: 'error' })
                    }
                }
            } catch (error) {
                console.log(error)
                enqueueSnackbar("Failed to fetch user data", { variant: 'error' })
            }

        }
    }

    return (
        <>
            <div className='np-container'>
                <h1 className='newpost-title'>Create Post</h1>
                <form className='post-form' onSubmit={handleNewPost}>
                    <input type="text" name='title' placeholder='Title' onChange={(e) => { setPTitle(e.target.value) }} required /><br />
                    <textarea rows={contentSize} name="description" onFocus={(e) => { setContentSize('10') }} className='postdesc' placeholder='Post body...' onChange={(e) => { setPBody(e.target.value) }} required />
                    <div className="post-btns">
                        <button className='login-btn' type="submit">Post</button>
                        <a className='cancel-btn' onClick={(e) => { 
                            setContentSize('4') 
                             }}>Cancel</ a>
                    </div>

                </form>
            </div>
        </>
    )
}
export default NewPost
