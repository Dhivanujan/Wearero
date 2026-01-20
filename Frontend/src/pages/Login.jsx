import React, { useState } from 'react'
import login from '../assets/login.jpg'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { API_BASE_URL } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

const Login = () => {
    const [email,setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate();
    const { mergeCart } = useCart();
    const { login: persistAuth } = useAuth();
    const location = useLocation();
    const redirectTo = location.state?.from?.pathname || '/';

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
        toast.error('Please enter your email and password');
        return;
    }

    setIsSubmitting(true);

    try {
        const response = await fetch(`${API_BASE_URL}/api/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();

        if (response.ok) {
            persistAuth(data);
            const role = data?.user?.role;
            const cameFromProtectedRoute = Boolean(location.state?.from);
            const defaultDestination = role === 'admin' ? '/admin' : '/';
            if (role !== 'admin') {
                await mergeCart();
            }
            toast.success(role === 'admin' ? 'Welcome back, admin!' : 'Welcome back!');
            navigate(cameFromProtectedRoute ? redirectTo : defaultDestination, { replace: true });
        } else {
            toast.error(data.message || 'Login failed');
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
        {/* Left - Form Section */}
        <div className='w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-12'>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='w-full max-w-md'
            >
                {/* Logo */}
                <Link to="/" className='inline-block mb-8'>
                    <span className='text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white font-heading'>Wearero</span>
                </Link>

                {/* Form Card */}
                <div className='bg-white dark:bg-gray-900 p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800'>
                    <div className='text-center mb-8'>
                        <h1 className='text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2'>Welcome back</h1>
                        <p className='text-gray-500 dark:text-gray-400 text-sm'>Sign in to your account to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} className='space-y-5'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Email address</label>
                            <div className='relative'>
                                <input 
                                    type="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    className='w-full px-4 py-3.5 pl-11 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all' 
                                    placeholder='name@example.com' 
                                />
                                <svg className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                                </svg>
                            </div>
                        </div>

                        <div>
                            <div className='flex items-center justify-between mb-2'>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                <Link to="#" className='text-xs text-accent hover:text-accent-hover font-medium'>Forgot password?</Link>
                            </div>
                            <div className='relative'>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    className='w-full px-4 py-3.5 pl-11 pr-11 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all' 
                                    placeholder='••••••••' 
                                />
                                <svg className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                                </svg>
                                <button 
                                    type='button'
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
                                >
                                    {showPassword ? (
                                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' />
                                        </svg>
                                    ) : (
                                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button 
                            type='submit' 
                            disabled={isSubmitting} 
                            className='w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2'
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <span>Sign In</span>
                            )}
                        </button>
                    </form>

                    <p className='mt-8 text-center text-sm text-gray-600 dark:text-gray-400'>
                        Don't have an account?{" "}
                        <Link to='/register' className='text-accent hover:text-accent-hover font-semibold'>Create account</Link>
                    </p>
                </div>

                {/* Trust Indicators */}
                <div className='mt-8 flex items-center justify-center space-x-6 text-xs text-gray-500 dark:text-gray-400'>
                    <div className='flex items-center space-x-1'>
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                        </svg>
                        <span>Secure login</span>
                    </div>
                    <div className='flex items-center space-x-1'>
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
                        </svg>
                        <span>Privacy protected</span>
                    </div>
                </div>
            </motion.div>
        </div>

        {/* Right - Image Section */}
        <div className='hidden lg:block w-1/2 relative overflow-hidden'>
            <div className='absolute inset-0 bg-gradient-to-br from-accent/20 to-purple-500/20 z-10'></div>
            <img src={login} alt="Login to Account" className='h-full w-full object-cover' />
            <div className='absolute inset-0 flex items-end z-20 p-12'>
                <div className='bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-white/20 max-w-md'>
                    <h2 className='text-2xl font-bold text-white mb-3'>Your style journey awaits</h2>
                    <p className='text-white/80 text-sm'>Access your wishlist, track orders, and enjoy personalized recommendations.</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login