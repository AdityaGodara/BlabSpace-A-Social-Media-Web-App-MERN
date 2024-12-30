import React from 'react'
import Header from '../Components/Header'
import ProfileCard from '../Components/ProfileCard'
import GangList from '../Components/GangList'
import Footer from '../Components/Footer'
import '../../style.css'

const Home = () => {
  return (
    <div className='body'>
        <Header />
        <ProfileCard />
        <GangList />
        <Footer />
    </div>
  )
}

export default Home
