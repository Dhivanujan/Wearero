import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HiOutlineUser, HiOutlineShoppingBag, HiOutlineHeart, HiHeart } from 'react-icons/hi2';
import { HiBars3CenterLeft } from 'react-icons/hi2';
import { IoMdClose } from 'react-icons/io';
import SearchBar from './SearchBar';
import CartDrawer from '../Layout/CartDrawer';
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
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  const navLinks = [
    { label: 'Men', to: '/collections/all?gender=Men' },
    { label: 'Women', to: '/collections/all?gender=Women' },
    { label: 'Top Wear', to: '/collections/all?category=Top Wear' },
    { label: 'Bottom Wear', to: '/collections/all?category=Bottom Wear' },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleNavDrawer = () => setNavDrawerOpen(!navDrawerOpen);
  const toggleCartDrawer = () => setDrawerOpen(!drawerOpen);
  const handleLogout = () => { logout(); navigate('/'); };

  const userInitials = user?.name
    ? user.name.split(' ').map((s) => s.charAt(0)).join('').slice(0, 2).toUpperCase()
    : '';

  // Unique background on homepage hero, solid otherwise
  const navBg = isScrolled || !isHomePage
    ? 'bg-white/85 dark:bg-gray-950/85 backdrop-blur-xl shadow-lg shadow-black/[0.03] dark:shadow-black/[0.2] border-b border-gray-100/50 dark:border-gray-800/50'
    : 'bg-black/30 backdrop-blur-sm border-b border-white/10';

  const textColor = isScrolled || !isHomePage
    ? 'text-gray-600 dark:text-gray-400'
    : 'text-white/80';

  const logoColor = isScrolled || !isHomePage
    ? 'text-gray-900 dark:text-white'
    : 'text-white';

  return (
    <>
      <nav className={`${isScrolled ? 'fixed top-0' : 'absolute'} w-full left-0 right-0 z-50 transition-all duration-500 ease-smooth ${navBg}`}>
        <div className="container mx-auto flex items-center justify-between py-4 px-6 lg:px-8">
          {/* Logo */}
          <div className="flex md:flex-1">
            <Link to="/" className="flex items-center space-x-2 group">
              <span className={`text-2xl font-extrabold tracking-tight font-heading transition-all duration-300 group-hover:text-accent dark:group-hover:text-accent-light ${logoColor}`}>
                Wearero
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center space-x-1 flex-1">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full hover:bg-white/10 dark:hover:bg-gray-800/80 group ${textColor} hover:text-gray-900 dark:hover:text-white ${!isScrolled && isHomePage ? 'hover:text-white' : ''}`}
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center justify-end space-x-2 flex-1">
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden sm:flex items-center space-x-1.5 bg-gradient-to-r from-accent to-purple-500 px-4 py-2 rounded-full text-sm text-white font-medium hover:shadow-glow transition-all duration-300 transform hover:scale-105"
              >
                <span>Admin</span>
              </Link>
            )}

            {user ? (
              <div className="flex items-center space-x-1">
                <Link
                  to="/wishlist"
                  className={`p-2.5 rounded-full hover:bg-white/10 dark:hover:bg-gray-800 transition-all duration-300 group ${!isScrolled && isHomePage ? '' : 'hover:bg-gray-100'}`}
                >
                  <HiOutlineHeart className={`w-5 h-5 transition-colors ${textColor} group-hover:text-accent`} />
                </Link>
                <Link
                  to="/profile"
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-full hover:bg-white/10 dark:hover:bg-gray-800 transition-all duration-300 group ${!isScrolled && isHomePage ? '' : 'hover:bg-gray-100'}`}
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-purple-500/20 dark:from-accent/30 dark:to-purple-500/30 text-accent dark:text-accent-light text-xs font-bold ring-2 ring-accent/20 dark:ring-accent-light/20">
                    {userInitials || <HiOutlineUser className="h-4 w-4" />}
                  </span>
                  <span className={`hidden sm:inline text-sm font-medium transition-colors ${isScrolled || !isHomePage ? 'text-gray-700 dark:text-gray-300' : 'text-white/90'}`}>
                    {user.name?.split(' ')[0]}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className={`hidden sm:block px-3 py-1.5 text-xs font-medium transition-all duration-300 rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 ${isScrolled || !isHomePage ? 'text-gray-500 dark:text-gray-400 hover:text-red-500' : 'text-white/70 hover:text-red-300'}`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link
                  to="/login"
                  className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full ${isScrolled || !isHomePage ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-white dark:bg-white text-gray-900 text-sm font-medium px-5 py-2.5 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Join Now
                </Link>
              </div>
            )}

            <div className={`h-6 w-px mx-1 hidden sm:block ${isScrolled || !isHomePage ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white/20'}`} />

            <ThemeToggle />

            <button
              onClick={toggleCartDrawer}
              className={`relative p-2.5 rounded-full transition-all duration-300 group ${!isScrolled && isHomePage ? 'hover:bg-white/10' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <HiOutlineShoppingBag className={`h-6 w-6 transition-all duration-300 group-hover:scale-110 ${textColor} ${!isScrolled && isHomePage ? 'group-hover:text-white' : 'group-hover:text-gray-900 dark:group-hover:text-white'}`} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-glow animate-scale-in">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            <div className="overflow-hidden">
              <SearchBar />
            </div>

            <button
              onClick={toggleNavDrawer}
              className={`md:hidden p-2.5 rounded-full transition-all duration-300 ${!isScrolled && isHomePage ? 'hover:bg-white/10' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <HiBars3CenterLeft className={`h-6 w-6 ${textColor}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar on non-home pages */}
      <div className={isHomePage ? '' : 'h-[72px]'} />

      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      {/* Mobile Navigation Drawer */}
      <div className={`fixed inset-0 z-50 transition-all duration-300 ${navDrawerOpen ? 'visible' : 'invisible'}`}>
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${navDrawerOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={toggleNavDrawer}
        />
        <div className={`absolute top-0 left-0 w-80 h-full bg-white dark:bg-gray-950 shadow-2xl transform transition-transform duration-300 ease-smooth ${navDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
            <span className="text-xl font-bold text-gray-900 dark:text-white font-heading">Menu</span>
            <button onClick={toggleNavDrawer} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <IoMdClose className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <div className="p-6">
            <nav className="space-y-1">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={toggleNavDrawer}
                  className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-300 font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 space-y-3">
              {!user ? (
                <>
                  <Link to="/login" onClick={toggleNavDrawer} className="block w-full text-center px-4 py-3 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={toggleNavDrawer} className="block w-full text-center px-4 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100">
                    Join Now
                  </Link>
                </>
              ) : (
                <button onClick={() => { handleLogout(); toggleNavDrawer(); }} className="block w-full text-center px-4 py-3 text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400 rounded-xl font-medium hover:bg-red-100 dark:hover:bg-red-900/50">
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
