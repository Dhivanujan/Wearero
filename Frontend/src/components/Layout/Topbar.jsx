import React from 'react'
import { TbBrandMeta } from 'react-icons/tb'
import { IoLogoInstagram } from 'react-icons/io5'
import { RiTwitterXLine } from 'react-icons/ri'

const Topbar = () => {
  return (
    <div className='bg-black text-white'>
        <div className='container mx-auto flex justify-between items-center py-3 px-6'>
            <div className='hidden md:flex items-center space-x-4 w-1/3'>
                <a href="#" className='hover:text-gray-300 transition-colors'>
                <TbBrandMeta className='h-5 w-5'/>
                </a>
                <a href="#" className='hover:text-gray-300 transition-colors'>
                <IoLogoInstagram className='h-5 w-5'/>
                </a>
                <a href="#" className='hover:text-gray-300 transition-colors'>
                <RiTwitterXLine className='h-4 w-4'/>
                </a>
            </div>
            <div className='text-sm text-center flex-grow md:w-1/3 font-medium tracking-wide'>
                <span>We ship worldwide - Fast and reliable shipping!</span>
            </div>
            <div className='text-sm hidden md:flex font-medium w-1/3 justify-end'>
               <a href="tel:+1234567890" className='hover:text-gray-300 transition-colors'>
                    +1 234 567 890
                </a> 
            </div>
            
        </div>
    </div>
  )
}

export default Topbar