import React from 'react';
import { Link } from 'react-router-dom';
import { TbBrandMeta } from 'react-icons/tb';
import { IoLogoInstagram } from 'react-icons/io5';
import { RiTwitterXLine } from 'react-icons/ri';
import { FiPhoneCall } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className='bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white border-t border-gray-100 dark:border-gray-800 transition-colors'>
        {/* Main Footer Content */}
        <div className='container mx-auto px-6 lg:px-8 py-16 lg:py-20'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8'>
                {/* Brand & Newsletter Section */}
                <div className='lg:col-span-5'>
                    <Link to="/" className='inline-block'>
                        <h3 className='text-2xl font-extrabold tracking-tight font-heading bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent'>
                            Wearero
                        </h3>
                    </Link>
                    <p className='mt-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-md'>
                        Discover curated fashion that defines your style. Be the first to know about new collections, exclusive events, and special offers.
                    </p>
                    
                    {/* Newsletter */}
                    <form className='mt-6 flex flex-col sm:flex-row gap-3 max-w-md'>
                        <div className='relative flex-1'>
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                className='w-full px-4 py-3.5 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all'
                                required
                            />
                        </div>
                        <button 
                            type='submit' 
                            className='px-6 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5'
                        >
                            Subscribe
                        </button>
                    </form>

                    {/* Social Links */}
                    <div className='flex items-center space-x-4 mt-8'>
                        <a href="https://www.facebook.com" target='_blank' rel='noopener noreferrer' className='w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-accent dark:hover:text-accent hover:border-accent/50 transition-all duration-300'>
                            <TbBrandMeta className='h-5 w-5'/>
                        </a>
                        <a href="https://www.instagram.com" target='_blank' rel='noopener noreferrer' className='w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-accent dark:hover:text-accent hover:border-accent/50 transition-all duration-300'>
                            <IoLogoInstagram className='h-5 w-5'/>
                        </a>
                        <a href="https://www.twitter.com" target='_blank' rel='noopener noreferrer' className='w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-accent dark:hover:text-accent hover:border-accent/50 transition-all duration-300'>
                            <RiTwitterXLine className='h-4 w-4'/>
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className='lg:col-span-2'>
                    <h4 className='text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-6'>Shop</h4>
                    <ul className='space-y-4'>
                        <li><Link to="/collections/all?gender=Men&category=Top Wear" className='text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors'>Men's Top Wear</Link></li>
                        <li><Link to="/collections/all?gender=Women&category=Top Wear" className='text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors'>Women's Top Wear</Link></li>
                        <li><Link to="/collections/all?gender=Men&category=Bottom Wear" className='text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors'>Men's Bottom Wear</Link></li>
                        <li><Link to="/collections/all?gender=Women&category=Bottom Wear" className='text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors'>Women's Bottom Wear</Link></li>
                    </ul>
                </div>

                {/* Support Links */}
                <div className='lg:col-span-2'>
                    <h4 className='text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-6'>Support</h4>
                    <ul className='space-y-4'>
                        <li><Link to="#" className='text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors'>Contact Us</Link></li>
                        <li><Link to="#" className='text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors'>About Us</Link></li>
                        <li><Link to="#" className='text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors'>FAQs</Link></li>
                        <li><Link to="#" className='text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors'>Shipping Info</Link></li>
                        <li><Link to="#" className='text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors'>Returns & Exchanges</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div className='lg:col-span-3'>
                    <h4 className='text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-6'>Contact</h4>
                    <ul className='space-y-4'>
                        <li className='flex items-start space-x-3'>
                            <svg className='w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                            </svg>
                            <span className='text-sm text-gray-600 dark:text-gray-400'>123 Fashion Street, NY 10001</span>
                        </li>
                        <li className='flex items-start space-x-3'>
                            <svg className='w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                            </svg>
                            <a href='mailto:hello@wearero.com' className='text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors'>hello@wearero.com</a>
                        </li>
                        <li className='flex items-start space-x-3'>
                            <svg className='w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                            </svg>
                            <a href='tel:+1234567890' className='text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors'>+1 (234) 567-890</a>
                        </li>
                    </ul>

                    {/* Payment Methods */}
                    <div className='mt-8'>
                        <h4 className='text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500 mb-3'>We Accept</h4>
                        <div className='flex items-center space-x-2'>
                            <div className='w-10 h-6 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-400'>VISA</div>
                            <div className='w-10 h-6 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-400'>MC</div>
                            <div className='w-10 h-6 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-400'>AMEX</div>
                            <div className='w-10 h-6 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-400'>PP</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-gray-200 dark:border-gray-800'>
            <div className='container mx-auto px-6 lg:px-8 py-6'>
                <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
                    <p className='text-sm text-gray-500 dark:text-gray-500'>
                        © 2025 Wearero. All rights reserved.
                    </p>
                    <div className='flex items-center space-x-6'>
                        <Link to="#" className='text-sm text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors'>Privacy Policy</Link>
                        <Link to="#" className='text-sm text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors'>Terms of Service</Link>
                        <Link to="#" className='text-sm text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors'>Cookies</Link>
                    </div>
                </div>
            </div>
        </div>
    </footer>
  );
};

export default Footer;
