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
        <nav className="container mx-auto flex items-center justify-between py-4 px-6">
            <div>
                 <Link to="/" className="text-2xl font-medium">Wearero</Link>
            </div>
            <div className='hidden md:flex space-x-6'>
                {navLinks.map((item) => (
                  <Link key={item.label} to={item.to} className='text-gray-700 hover:text-black text-sm font-medium uppercase'>
                    {item.label}
                  </Link>
                ))}
            </div>
            <div className='flex items-center space-x-4'>
                {isAdmin && (
                  <Link to="/admin" className='hidden sm:block bg-black px-3 py-1.5 rounded text-sm text-white'>Admin</Link>
                )}

                {user ? (
                  <div className='flex items-center space-x-3'>
                    <Link to='/profile' className='flex items-center space-x-2 hover:text-black'>
                      <span className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white text-xs font-semibold'>
                        {userInitials || <HiOutlineUser className='h-4 w-4' />}
                      </span>
                      <span className='hidden sm:inline text-sm font-medium text-gray-700'>{user.name}</span>
                    </Link>
                    <button onClick={handleLogout} className='text-xs text-gray-600 hover:text-black'>Logout</button>
                  </div>
                ) : (
                  <div className='hidden sm:flex items-center space-x-3'>
                    <Link to='/login' className='text-sm font-semibold text-gray-700 hover:text-black'>Sign In</Link>
                    <Link to='/register' className='bg-black text-white text-sm font-semibold px-4 py-2 rounded'>Join Now</Link>
                  </div>
                )}
                <button onClick={toggleCartDrawer} className='relative hover:text-black'>
                  <HiOutlineShoppingBag className='h-6 w-6 text-gray-700'/>
                  {cartCount > 0 && (
                    <span className='absolute -top-1 bg-bluish text-white text-xs rounded-full px-2 py-0.5'>{cartCount}</span>
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


