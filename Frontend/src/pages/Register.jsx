import React, { useState } from 'react'
import { motion } from 'framer-motion'
import register from '../assets/register.jpg'
import { Link, useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { toast } from 'sonner'
import { HiOutlineUser, HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash, HiOutlineShoppingBag, HiOutlineCog6Tooth, HiOutlineShieldCheck, HiOutlineSparkles } from 'react-icons/hi2'

const Register = () => {
    const [name, setName] = useState('')
    const [email,setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('customer')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate();
    const { login } = useAuth();
    const { mergeCart } = useCart();

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
        toast.error('All fields are required');
        return;
    }

    if (password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
    }

    setIsSubmitting(true);

    try {
        const response = await fetch(`${API_BASE_URL}/api/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, role }),
        });
        const contentType = response.headers.get('content-type') || '';
        const data = contentType.includes('application/json')
          ? await response.json()
          : await response.text();

        if (response.ok) {
            login(data);
            if (role !== 'admin') {
                await mergeCart();
            }
            toast.success(role === 'admin' ? 'Admin account created' : 'Registration successful');
            navigate(role === 'admin' ? '/admin' : '/');
        } else {
            const message = typeof data === 'string' && data
              ? data
              : data?.message;
            toast.error(message || 'Registration failed');
        }
    } catch (error) {
        console.error(error);
        toast.error('Something went wrong. Please try again.');
    } finally {
        setIsSubmitting(false);
    }
}

  return (
    <div className='flex min-h-screen bg-gray-50 dark:bg-gray-950'>
        {/* Left Side - Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className='w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-8 lg:p-12'
        >
            <div className='w-full max-w-md'>
                {/* Logo */}
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className='text-center mb-8'
                >
                    <Link to='/' className='inline-flex items-center gap-2'>
                        <div className='w-10 h-10 bg-gradient-to-br from-accent-600 to-accent-500 rounded-xl flex items-center justify-center'>
                            <HiOutlineSparkles className='w-6 h-6 text-white' />
                        </div>
                        <span className='text-2xl font-bold text-gray-900 dark:text-white'>Wearero</span>
                    </Link>
                </motion.div>

                {/* Form Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className='bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800'
                >
                    <div className='text-center mb-8'>
                        <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>Create your account</h1>
                        <p className='text-gray-500 dark:text-gray-400 text-sm'>Join Wearero and start shopping today</p>
                    </div>

                    <form onSubmit={handleSubmit} className='space-y-5'>
                        {/* Name Field */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                Full Name
                            </label>
                            <div className='relative'>
                                <HiOutlineUser className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                                <input 
                                    type="text" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    className='w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all' 
                                    placeholder='Enter your full name' 
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                Email Address
                            </label>
                            <div className='relative'>
                                <HiOutlineEnvelope className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                                <input 
                                    type="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    className='w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all' 
                                    placeholder='Enter your email' 
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Password
                            </label>
                            <div className='relative'>
                                <HiOutlineLockClosed className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                                <input 
                                    type={showPassword ? 'text' : 'password'}
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    className='w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all' 
                                    placeholder='Create a password' 
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
                                >
                                    {showPassword ? <HiOutlineEyeSlash className='w-5 h-5' /> : <HiOutlineEye className='w-5 h-5' />}
                                </button>
                            </div>
                            <p className='mt-2 text-xs text-gray-500 dark:text-gray-400'>Must be at least 8 characters</p>
                        </div>

                        {/* Account Type */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
                                Account Type
                            </label>
                            <div className='grid grid-cols-2 gap-3'>
                                <motion.label 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`relative flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all ${
                                        role === 'customer' 
                                            ? 'bg-accent-50 dark:bg-accent-900/20 border-2 border-accent-500 ring-2 ring-accent-500/20' 
                                            : 'bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="customer"
                                        checked={role === 'customer'}
                                        onChange={(e) => setRole(e.target.value)}
                                        className='sr-only'
                                    />
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                                        role === 'customer' 
                                            ? 'bg-accent-100 dark:bg-accent-900/40 text-accent-600 dark:text-accent-400' 
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                    }`}>
                                        <HiOutlineShoppingBag className='w-5 h-5' />
                                    </div>
                                    <span className={`font-medium text-sm ${role === 'customer' ? 'text-accent-700 dark:text-accent-300' : 'text-gray-700 dark:text-gray-300'}`}>
                                        Customer
                                    </span>
                                    <span className='text-xs text-gray-500 dark:text-gray-400 text-center mt-1'>Shop & track orders</span>
                                </motion.label>

                                <motion.label 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`relative flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all ${
                                        role === 'admin' 
                                            ? 'bg-accent-50 dark:bg-accent-900/20 border-2 border-accent-500 ring-2 ring-accent-500/20' 
                                            : 'bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="admin"
                                        checked={role === 'admin'}
                                        onChange={(e) => setRole(e.target.value)}
                                        className='sr-only'
                                    />
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                                        role === 'admin' 
                                            ? 'bg-accent-100 dark:bg-accent-900/40 text-accent-600 dark:text-accent-400' 
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                    }`}>
                                        <HiOutlineCog6Tooth className='w-5 h-5' />
                                    </div>
                                    <span className={`font-medium text-sm ${role === 'admin' ? 'text-accent-700 dark:text-accent-300' : 'text-gray-700 dark:text-gray-300'}`}>
                                        Admin
                                    </span>
                                    <span className='text-xs text-gray-500 dark:text-gray-400 text-center mt-1'>Manage store</span>
                                </motion.label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <motion.button 
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type='submit' 
                            disabled={isSubmitting} 
                            className='w-full bg-gradient-to-r from-accent-600 to-accent-500 hover:from-accent-700 hover:to-accent-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-accent-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className='animate-spin w-5 h-5' fill='none' viewBox='0 0 24 24'>
                                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                    </svg>
                                    Creating account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </motion.button>
                    </form>

                    {/* Sign In Link */}
                    <p className='mt-6 text-center text-sm text-gray-600 dark:text-gray-400'>
                        Already have an account?{' '}
                        <Link to='/login' className='text-accent-600 dark:text-accent-400 font-semibold hover:underline'>
                            Sign in
                        </Link>
                    </p>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className='mt-8 flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400'
                >
                    <div className='flex items-center gap-2'>
                        <HiOutlineShieldCheck className='w-4 h-4 text-green-500' />
                        <span>Secure</span>
                    </div>
                    <div className='w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600'></div>
                    <div className='flex items-center gap-2'>
                        <span>🔒</span>
                        <span>Privacy Protected</span>
                    </div>
                </motion.div>
            </div>
        </motion.div>

        {/* Right Side - Image */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className='hidden lg:block lg:w-1/2 relative'
        >
            <img 
                src={register} 
                alt="Join Wearero" 
                className='absolute inset-0 w-full h-full object-cover'
            />
            {/* Overlay */}
            <div className='absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent'></div>
            
            {/* Content Overlay */}
            <div className='absolute inset-0 flex flex-col justify-end p-12'>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className='max-w-md'
                >
                    <div className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20'>
                        <h3 className='text-2xl font-bold text-white mb-3'>
                            Join thousands of fashion lovers
                        </h3>
                        <p className='text-gray-200 text-sm leading-relaxed'>
                            Create your account today and get access to exclusive deals, personalized recommendations, and early access to new collections.
                        </p>
                        <div className='mt-4 flex items-center gap-4'>
                            <div className='flex -space-x-2'>
                                {[1,2,3,4].map(i => (
                                    <div key={i} className='w-8 h-8 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 border-2 border-white flex items-center justify-center text-white text-xs font-medium'>
                                        {String.fromCharCode(64 + i)}
                                    </div>
                                ))}
                            </div>
                            <span className='text-white/80 text-sm'>+10k members joined this month</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    </div>
  )
}

export default Register