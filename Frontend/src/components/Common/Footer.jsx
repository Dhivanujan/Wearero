import React from 'react';
import { Link } from 'react-router-dom';
import { TbBrandMeta } from 'react-icons/tb';
import { IoLogoInstagram } from 'react-icons/io5';
import { RiTwitterXLine } from 'react-icons/ri';
import { FiPhoneCall } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className='bg-white dark:bg-gray-900 text-black dark:text-white py-16 border-t border-gray-100 dark:border-gray-800 transition-colors'>
        <div className='container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 px-6 lg:px-8'>
            {/* Newsletter Section */}
            <div className='text-center md:text-left'>
                <h3 className='text-xl font-bold mb-6 tracking-tight font-heading'>Wearero</h3>
                <p className='text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6 font-light'>
                    Be the first to discover new products, attend exclusive events, and enjoy special online deals.
                </p>
                <form className='flex flex-col gap-3 max-w-sm mx-auto md:mx-0'>
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        className='w-full p-3 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all'
                        required
                    />
                    <button type='submit' className='bg-black dark:bg-white text-white dark:text-black px-6 py-3 text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-soft'>
                        Subscribe
                    </button>
                </form>
            </div>

            {/* Shop Links */}
            <div className='text-center md:text-left'>
                <h3 className='text-xs font-bold uppercase tracking-widest mb-6 font-heading text-gray-900 dark:text-white'>Shop</h3>
                <ul className='space-y-4 text-sm text-gray-500 dark:text-gray-400 font-light'>
                    <li><Link to="#" className='hover:text-black dark:hover:text-white transition-colors hover:underline underline-offset-4'>Men's Top Wear</Link></li>
                    <li><Link to="#" className='hover:text-black dark:hover:text-white transition-colors hover:underline underline-offset-4'>Women's Top Wear</Link></li>
                    <li><Link to="#" className='hover:text-black dark:hover:text-white transition-colors hover:underline underline-offset-4'>Men's Bottom Wear</Link></li>
                    <li><Link to="#" className='hover:text-black dark:hover:text-white transition-colors hover:underline underline-offset-4'>Women's Bottom Wear</Link></li>
                </ul>
            </div>

            {/* Support Links */}
            <div className='text-center md:text-left'>
                <h3 className='text-sm font-bold uppercase tracking-wider mb-6 font-heading'>Support</h3>
                <ul className='space-y-4 text-sm text-gray-600 dark:text-gray-400'>
                    <li><Link to="#" className='hover:text-black dark:hover:text-white transition-colors hover:underline underline-offset-4'>Contact Us</Link></li>
                    <li><Link to="#" className='hover:text-black dark:hover:text-white transition-colors hover:underline underline-offset-4'>About Us</Link></li>
                    <li><Link to="#" className='hover:text-black dark:hover:text-white transition-colors hover:underline underline-offset-4'>FAQs</Link></li>
                    <li><Link to="#" className='hover:text-black dark:hover:text-white transition-colors hover:underline underline-offset-4'>Features</Link></li>
                </ul>
            </div>

            {/* Follow Us */}
            <div className='text-center md:text-left'>
                <h3 className='text-sm font-bold uppercase tracking-wider mb-6 font-heading'>Follow Us</h3>
                <div className='flex items-center justify-center md:justify-start space-x-5 mb-8'>
                    <a href="https://www.facebook.com" target='_blank' rel='noopener noreferrer' className='text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors transform hover:scale-110'>
                        <TbBrandMeta className='h-6 w-6'/>
                    </a>
                    <a href="https://www.instagram.com" target='_blank' rel='noopener noreferrer' className='text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors transform hover:scale-110'>
                        <IoLogoInstagram className='h-6 w-6'/>
                    </a>
                    <a href="https://www.twitter.com" target='_blank' rel='noopener noreferrer' className='text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors transform hover:scale-110'>
                        <RiTwitterXLine className='h-5 w-5'/>
                    </a>
                </div>
                <h3 className='text-sm font-bold uppercase tracking-wider mb-4 font-heading'>Call Us</h3>
                <p className='text-gray-600 dark:text-gray-400 text-sm'>+123-456-7890</p>
            </div>
        </div>
        <div className='container mx-auto mt-16 border-t border-gray-100 dark:border-gray-800 pt-8 px-6 lg:px-8'>
            <p className='text-gray-500 text-sm text-center'>
                &copy; 2025, Wearero. All Rights Reserved.
            </p>
        </div>
    </footer>
  );
};

export default Footer;
