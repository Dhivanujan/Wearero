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
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 selection:bg-accent/20 selection:text-accent">
      <Header/>
      <main className="flex-grow flex flex-col">
        <Outlet/>
      </main>
      <Footer/>
    </div>
  )
}

export default UserLayout