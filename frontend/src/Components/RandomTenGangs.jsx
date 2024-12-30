import React, { useEffect, useState } from 'react'
import './style/rtg.css'
import axios from 'axios'
import { enqueueSnackbar } from 'notistack'
import {Link} from 'react-router-dom'

const RandomTenGangs = () => {

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
    <div className='rtg-container'>
      <h1 className='rtg-head-txt'>Random 10 Gangs:</h1>
      <div className='rtg-gang-card-container'>
            {gangs?.slice(0, 10).map((gang) => (
                <div key={gang._id} className='rtg-gang-card'>
                    <h1 className='rtg-gang-name'>{gang.name}</h1>
                    <p className="rtg-gang-tagline">{gang.tagline}</p>
                    <p className="rtg-gangsign">{gang.gangsign}</p>
                    <p className="rtg-member-count">{gang.category}</p>
                    <Link to={`/gang/info/${gang._id}`}>
                    <button type='button' className="rtg-info-btn" >
                        Info
                    </button></Link>
                </div>
            ))}
        </div>
    </div>
  )
}

export default RandomTenGangs
