import React, { useEffect, useState } from 'react'
import './style/ganglist.css'
import axios from 'axios'
import { enqueueSnackbar } from 'notistack'
import {Link} from 'react-router-dom'

const GangList = () => {
    const [gangs, setGangs] = useState([])

    useEffect(() => {
        fetchGangs()
    }, [])

    const fetchGangs = () => {
        axios.get('http://localhost:5555/gang/all-gangs')
            .then((res) => {
                const shuffledData = res.data.data.sort(() => Math.random() - 0.5)
                setGangs(shuffledData)
            })
            .catch((error) => {
                console.log(error)
                enqueueSnackbar("Failed to fetch gangs", { variant: 'error' })
            })
    }

    return (
      
        <div className='gang-card-container'>
            {gangs?.slice(0, 8).map((gang) => (
                <div key={gang._id} className='gang-card'>
                    <img src={gang.logo} alt="" className="glist-gang-stamp" />
                    <h1 className='gang-name'>{gang.name}</h1>
                    <p className="gang-tagline">{gang.tagline}</p>
                    <p className="gangsign">{gang.gangsign}</p>
                    <p className="member-count">{gang.category}</p>
                    <Link to={`/gang/info/${gang._id}`}>
                    <button type='button' className="info-btn" >
                        Info
                    </button></Link>
                </div>
            ))}
        </div>
    )
}

export default GangList