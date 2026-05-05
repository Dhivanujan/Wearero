import React from 'react'
import Topbar from '../Layout/Topbar'
import Navbar from '../Common/Navbar'

const Header = () => {
  return (
    <header className="relative z-50">
      <Topbar/>
      <Navbar/>
    </header>
  )
}

export default Header