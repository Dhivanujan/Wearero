import React, { useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import CartContents from '../Cart/CartContents'
import { useNavigate } from 'react-router-dom'

const CartDrawer = ({drawerOpen, toggleCartDrawer}) => {
  const navigate = useNavigate();
const handleCheckout = () => {
    toggleCartDrawer();
    navigate("/checkout")
}

    return (
    <div className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem] h-full bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 flex flex-col z-50 ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}>
        {/* (Close Button) */}
        <div className='flex justify-end p-4'>
            <button onClick={toggleCartDrawer}>
                <IoMdClose className='h-6 w-6 text-gray-600 dark:text-gray-400'/>
            </button>
        </div>
        {/* {Cart contents with scrollable area} */}
        <div className='flex-grow p-4 overflow-y-auto'>
            <h2 className='text-xl font-semibold mb-4 text-black dark:text-white'>Your Cart</h2>
            <CartContents />
        </div>
        {/* {Checkout Button fixed at the bottom} */}
        <div className='p-4 bg-white dark:bg-gray-900 stickey bottom-0'>
            <button 
            onClick={handleCheckout}
            className='w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition'>Checkout</button>
            <p className='text-sm tracking-tighter text-gray-500 dark:text-gray-400 mt-2 text-center'>Final shipping costs, taxes, and discounts will be calculated at checkout</p>
        </div>
    </div>
  )
}

export default CartDrawer