import React, { useEffect } from 'react'
import Header from '../Common/Header'
import Footer from '../Common/Footer'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const UserLayout = () => {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin && location.pathname === '/') {
      navigate('/admin', { replace: true });
    }
  }, [isAdmin, location.pathname, navigate]);

  return (
    <>
      <Header/>
      <main>
        <Outlet/>
      </main>
      <Footer/>
    </>
    
  )
}

export default UserLayout