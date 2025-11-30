import React, { useState } from 'react'
import login from '../assets/login.jpg'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { API_BASE_URL } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { toast } from 'sonner'

const Login = () => {
    const [email,setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
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
    <div className='flex min-h-screen'>
        <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12 bg-gray-50'>
            <form onSubmit={handleSubmit} className='w-full max-w-md bg-white p-10 rounded-xl shadow-lg border border-gray-100'>
                <div className='flex justify-center mb-8'>
                    <h2 className='text-3xl font-bold tracking-tight'>Wearero</h2>
                </div>
                <h2 className='text-2xl font-bold text-center mb-2'>Welcome back 👋🏻</h2>
                <p className='text-center mb-8 text-sm text-gray-500'>Sign in with your Wearero credentials. Admins gain access to catalog, order, and user management tools.</p>
                <div className='mb-6'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
                    <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all' 
                    placeholder='Enter your email address' />
                </div>
                <div className='mb-8'>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all' 
                    placeholder='Enter your password' />
                </div>
                <button type='submit' disabled={isSubmitting} className='w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md'>
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                </button>
                <p className='mt-8 text-center text-sm text-gray-600'>
                    Don't have an account? {" "}
                    <Link to='/register' className='text-black font-semibold hover:underline'>Register</Link>
                    </p>
            </form>
        </div>

    <div className='hidden md:block w-1/2 bg-gray-800'>
        <div className='h-full flex flex-col justify-center items-center'>
            <img src={login} alt="Login to Account" className='h-full w-full object-cover'  />
        </div>
    </div>

    </div>
  )
}

export default Login