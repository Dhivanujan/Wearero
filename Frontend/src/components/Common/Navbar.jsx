import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineUser, HiOutlineShoppingBag} from 'react-icons/hi'
import { HiBars3CenterLeft } from "react-icons/hi2";
import SearchBar from './SearchBar'
import CartDrawer from '../Layout/CartDrawer';
import { IoMdClose } from 'react-icons/io';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {

const [drawerOpen, setDrawerOpen] = useState(false);
const [navDrawerOpen, setNavDrawerOpen] = useState(false);
const [isScrolled, setIsScrolled] = useState(false);
const { cartCount } = useCart();
const { user, isAdmin, logout } = useAuth();
const navigate = useNavigate();
const navLinks = [
  { label: 'Men', to: '/collections/all?gender=Men' },
  { label: 'Women', to: '/collections/all?gender=Women' },
  { label: 'Top Wear', to: '/collections/all?category=Top Wear' },
  { label: 'Bottom Wear', to: '/collections/all?category=Bottom Wear' }
];

// Handle scroll effect
useEffect(() => {
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 20);
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

const toggleNavDrawer = () => {
  setNavDrawerOpen(!navDrawerOpen);
}

const toggleCartDrawer = () => {
  setDrawerOpen(!drawerOpen);
}

const handleLogout = () => {
  logout();
  navigate('/');
}

const userInitials = user?.name
  ? user.name
      .split(' ')
      .map((segment) => segment.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase()
  : '';
  return (
    <>
        <nav className={`sticky top-0 z-50 transition-all duration-500 ease-smooth ${
          isScrolled 
            ? 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-lg shadow-black/[0.03] dark:shadow-black/[0.2] border-b border-gray-100/50 dark:border-gray-800/50' 
            : 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-transparent'
        }`}>
            <div className="container mx-auto flex items-center justify-between py-4 px-6 lg:px-8">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <span className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white font-heading transition-all duration-300 group-hover:text-accent dark:group-hover:text-accent-light">
                Wearero
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className='hidden md:flex items-center space-x-1'>
                {navLinks.map((item) => (
                  <Link 
                    key={item.label} 
                    to={item.to} 
                    className='relative px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-300 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/80 group'
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                  </Link>
                ))}
            </div>

            {/* Right Actions */}
            <div className='flex items-center space-x-2'>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className='hidden sm:flex items-center space-x-1.5 bg-gradient-to-r from-accent to-purple-500 px-4 py-2 rounded-full text-sm text-white font-medium hover:shadow-glow transition-all duration-300 transform hover:scale-105'
                  >
                    <span>Admin</span>
                  </Link>
                )}

                {user ? (
                  <div className='flex items-center space-x-1'>
                    <Link 
                      to='/wishlist' 
                      className='p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group'
                    >
                      <i className="ri-heart-line text-xl text-gray-600 dark:text-gray-400 group-hover:text-accent dark:group-hover:text-accent-light transition-colors"></i>
                    </Link>
                    <Link 
                      to='/profile' 
                      className='flex items-center space-x-2 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group'
                    >
                      <span className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-purple-500/20 dark:from-accent/30 dark:to-purple-500/30 text-accent dark:text-accent-light text-xs font-bold ring-2 ring-accent/20 dark:ring-accent-light/20'>
                        {userInitials || <HiOutlineUser className='h-4 w-4' />}
                      </span>
                      <span className='hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors'>{user.name?.split(' ')[0]}</span>
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className='px-3 py-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-rabbit-red dark:hover:text-rabbit-red font-medium transition-all duration-300 rounded-full hover:bg-red-50 dark:hover:bg-red-950/30'
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className='hidden sm:flex items-center space-x-2'>
                    <Link 
                      to='/login' 
                      className='px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800'
                    >
                      Sign In
                    </Link>
                    <Link 
                      to='/register' 
                      className='bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium px-5 py-2.5 rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                    >
                      Join Now
                    </Link>
                  </div>
                )}
                
                <div className='h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden sm:block'></div>
                
                <ThemeToggle />

                <button 
                  onClick={toggleCartDrawer} 
                  className='relative p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group'
                >
                  <HiOutlineShoppingBag className='h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-all duration-300 group-hover:scale-110'/>
                  {cartCount > 0 && (
                    <span className='absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-glow animate-scale-in'>
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </button>

                {/* Search */}
                <div className='overflow-hidden'>
                  <SearchBar/>
                </div>

                {/* Mobile menu button */}
                <button 
                  onClick={toggleNavDrawer} 
                  className='md:hidden p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300'
                >
                  <HiBars3CenterLeft className='h-6 w-6 text-gray-600 dark:text-gray-400'/>
                </button>

            </div>
            </div>
        </nav>
        <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer}/>

        {/* Mobile Navigation Drawer */}
        <div 
          className={`fixed inset-0 z-50 transition-all duration-300 ${navDrawerOpen ? 'visible' : 'invisible'}`}
        >
          {/* Backdrop */}
          <div 
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${navDrawerOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={toggleNavDrawer}
          ></div>
          
          {/* Drawer */}
          <div className={`absolute top-0 left-0 w-80 h-full bg-white dark:bg-gray-950 shadow-2xl transform transition-transform duration-300 ease-smooth ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className='flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800'>
              <span className="text-xl font-bold text-gray-900 dark:text-white font-heading">Menu</span>
              <button 
                onClick={toggleNavDrawer} 
                className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
              >
                <IoMdClose className='h-6 w-6 text-gray-500 dark:text-gray-400'/>
              </button>
            </div>
            <div className='p-6'>
              <nav className='space-y-1'>
                {navLinks.map((item) => (
                  <Link 
                    key={item.label} 
                    to={item.to} 
                    onClick={toggleNavDrawer} 
                    className='flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-300 font-medium'
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              {!user && (
                <div className='mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 space-y-3'>
                  <Link 
                    to="/login" 
                    onClick={toggleNavDrawer} 
                    className='block w-full text-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-700 rounded-xl transition-all duration-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800'
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={toggleNavDrawer} 
                    className='block w-full text-center px-4 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl transition-all duration-300 font-medium hover:bg-gray-800 dark:hover:bg-gray-100'
                  >
                    Join Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
    </>
    
  )
}

export default Navbar


