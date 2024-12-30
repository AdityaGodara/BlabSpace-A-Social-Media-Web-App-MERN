import React, { useState } from 'react'
import './style/header.css'

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <>
            <nav className="navbar">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">
                        <img src="/Images/logo.png" alt="Logo" width="50" className="logo" />
                        <span className='title'>BLABSPACE</span>
                    </a>
                    <button className="menu-toggle" onClick={toggleMenu}>
                        ☰
                    </button>
                    <ul className={`nav-items ${isMenuOpen ? 'active' : ''}`}>
                        <li><a href="/" className='nav-links'>Home</a></li>
                        <li><a href="/your-space" className='nav-links'>Your Space</a></li>

                        
                    </ul>
                </div>
            </nav>
        </>
    )
}

export default Header