import React, { useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import CartContents from '../Cart/CartContents'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

const CartDrawer = ({drawerOpen, toggleCartDrawer}) => {
  const navigate = useNavigate();
  const { cart } = useCart();

  const handleCheckout = () => {
    toggleCartDrawer();
    navigate("/checkout")
  }

  const subtotal = cart?.totalPrice || 0;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${drawerOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={toggleCartDrawer}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 w-full sm:w-[420px] h-full bg-white dark:bg-gray-950 shadow-2xl transform transition-transform duration-300 ease-smooth flex flex-col z-50 ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800'>
          <div className='flex items-center space-x-3'>
            <h2 className='text-xl font-bold text-gray-900 dark:text-white'>Shopping Bag</h2>
            {cart?.products?.length > 0 && (
              <span className='inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-accent rounded-full'>
                {cart.products.length}
              </span>
            )}
          </div>
          <button 
            onClick={toggleCartDrawer} 
            className='p-2 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
          >
            <IoMdClose className='h-6 w-6 text-gray-500 dark:text-gray-400'/>
          </button>
        </div>

        {/* Cart Contents */}
        <div className='flex-1 overflow-y-auto p-4'>
          <CartContents />
        </div>

        {/* Footer */}
        {cart?.products?.length > 0 && (
          <div className='p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 space-y-4'>
            {/* Subtotal */}
            <div className='flex items-center justify-between'>
              <span className='text-gray-600 dark:text-gray-400'>Subtotal</span>
              <span className='text-xl font-bold text-gray-900 dark:text-white'>${subtotal.toLocaleString()}</span>
            </div>

            {/* Checkout Button */}
            <button 
              onClick={handleCheckout}
              className='group relative w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 rounded-2xl font-semibold text-base overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5'
            >
              <span className='relative z-10 flex items-center justify-center space-x-2'>
                <span>Proceed to Checkout</span>
                <svg className='w-5 h-5 transform group-hover:translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                </svg>
              </span>
            </button>

            {/* Trust Badges */}
            <div className='flex items-center justify-center space-x-4 pt-2'>
              <div className='flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400'>
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                </svg>
                <span>Secure checkout</span>
              </div>
              <div className='flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400'>
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' />
                </svg>
                <span>All cards accepted</span>
              </div>
            </div>

            <p className='text-xs text-center text-gray-500 dark:text-gray-400'>
              Shipping & taxes calculated at checkout
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default CartDrawer