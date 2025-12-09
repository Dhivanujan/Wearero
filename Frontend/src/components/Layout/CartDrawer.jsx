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
    <div className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem] h-full bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 flex flex-col z-50 ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}>
        {/* (Close Button) */}
        <div className='flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800'>
            <h2 className='text-xl font-bold text-black dark:text-white font-heading'>Your Cart</h2>
            <button onClick={toggleCartDrawer} className='p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors'>
                <IoMdClose className='h-6 w-6 text-gray-600 dark:text-gray-400'/>
            </button>
        </div>
        {/* {Cart contents with scrollable area} */}
        <div className='flex-grow p-6 overflow-y-auto'>
            <CartContents />
        </div>
        {/* {Checkout Button fixed at the bottom} */}
        <div className='p-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800'>
            <button 
            onClick={handleCheckout}
            className='w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-full font-semibold text-lg hover:bg-gray-900 dark:hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'>Checkout</button>
            <p className='text-xs tracking-wide text-gray-500 dark:text-gray-400 mt-4 text-center'>Shipping, taxes, and discounts calculated at checkout</p>
        </div>
    </div>
  )
}

export default CartDrawer