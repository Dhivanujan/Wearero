import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineUser, HiOutlineShoppingBag} from 'react-icons/hi'
import { HiBars3CenterLeft } from "react-icons/hi2";
import SearchBar from './SearchBar'
import CartDrawer from '../Layout/CartDrawer';
import { IoMdClose } from 'react-icons/io';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {

const [drawerOpen, setDrawerOpen] = useState(false);
const [navDrawerOpen, setNavDrawerOpen] = useState(false);
const { cartCount } = useCart();
const { user, isAdmin, logout } = useAuth();
const navigate = useNavigate();
const navLinks = [
  { label: 'Men', to: '/collections/all?gender=Men' },
  { label: 'Women', to: '/collections/all?gender=Women' },
  { label: 'Top Wear', to: '/collections/all?category=Top Wear' },
  { label: 'Bottom Wear', to: '/collections/all?category=Bottom Wear' }
];

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
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
            <div className="container mx-auto flex items-center justify-between py-4 px-6">
            <div>
                 <Link to="/" className="text-2xl font-bold tracking-tight">Wearero</Link>
            </div>
            <div className='hidden md:flex space-x-8'>
                {navLinks.map((item) => (
                  <Link key={item.label} to={item.to} className='text-gray-600 hover:text-black text-sm font-medium uppercase tracking-wide transition-colors'>
                    {item.label}
                  </Link>
                ))}
            </div>
            <div className='flex items-center space-x-6'>
                {isAdmin && (
                  <Link to="/admin" className='hidden sm:block bg-black px-4 py-1.5 rounded-md text-sm text-white font-medium hover:bg-gray-800 transition-colors'>Admin</Link>
                )}

                {user ? (
                  <div className='flex items-center space-x-3'>
                    <Link to='/profile' className='flex items-center space-x-2 hover:text-black transition-colors'>
                      <span className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-800 text-xs font-bold border border-gray-200'>
                        {userInitials || <HiOutlineUser className='h-4 w-4' />}
                      </span>
                      <span className='hidden sm:inline text-sm font-medium text-gray-700'>{user.name}</span>
                    </Link>
                    <button onClick={handleLogout} className='text-xs text-gray-500 hover:text-red-500 font-medium transition-colors'>Logout</button>
                  </div>
                ) : (
                  <div className='hidden sm:flex items-center space-x-4'>
                    <Link to='/login' className='text-sm font-medium text-gray-600 hover:text-black transition-colors'>Sign In</Link>
                    <Link to='/register' className='bg-black text-white text-sm font-medium px-5 py-2 rounded-md hover:bg-gray-800 transition-colors'>Join Now</Link>
                  </div>
                )}
                <button onClick={toggleCartDrawer} className='relative hover:text-black transition-colors'>
                  <HiOutlineShoppingBag className='h-6 w-6 text-gray-700'/>
                  {cartCount > 0 && (
                    <span className='absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center'>{cartCount}</span>
                  )}
                </button>
                {/* {Search} */}
                <div className='overflow-hidden'>
                  <SearchBar/>
                </div>
                {/* Hamburger icon for mobile */}
                <button onClick={toggleNavDrawer} className='md:hidden'>
                  <HiBars3CenterLeft className='h-6 w-6 text-gray-700'/>
                </button>

            </div>
            </div>
        </nav>
        <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer}/>

        {/* {MObile navigation} */}
        <div className={`fixed top-0 left-0 w-1/3 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div>
            <button onClick={toggleNavDrawer} className='flex justify-end p-4'>
              <IoMdClose className='h-6 w-6 text-gray-600'/>
            </button>
          </div>
          <div className='p-4'>
            <h2 className='text-xl font-semibold mb-4'>Menu</h2>
            <nav className='space-y-4'>
              {navLinks.map((item) => (
                <Link key={item.label} to={item.to} onClick={toggleNavDrawer} className='block text-gray-600 hover:text-black'>
                  {item.label}
                </Link>
              ))}
              {!user && (
                <>
                  <Link to="/login" onClick={toggleNavDrawer} className='block text-gray-600 hover:text-black'>Sign In</Link>
                  <Link to="/register" onClick={toggleNavDrawer} className='block text-gray-600 hover:text-black'>Join Now</Link>
                </>
              )}
            </nav>
          </div>
        </div>
    </>
    
  )
}

export default Navbar


