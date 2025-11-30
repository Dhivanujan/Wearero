import React, { useState } from 'react'
import register from '../assets/register.jpg'
import { Link, useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { toast } from 'sonner'

const Register = () => {
    const [name, setName] = useState('')
    const [email,setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('customer')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate();
    const { login } = useAuth();
    const { mergeCart } = useCart();

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
        toast.error('All fields are required');
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
        const data = await response.json();

        if (response.ok) {
            login(data);
            if (role !== 'admin') {
                await mergeCart();
            }
            toast.success(role === 'admin' ? 'Admin account created' : 'Registration successful');
            navigate(role === 'admin' ? '/admin' : '/');
        } else {
            toast.error(data.message || 'Registration failed');
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
            <form onSubmit={handleSubmit} className='w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100'>
                <div className='flex justify-center mb-6'>
                    <h2 className='text-3xl font-bold tracking-tight'>Wearero</h2>
                </div>
                <h2 className='text-2xl font-bold text-center mb-6'>Create your account</h2>
                <p className='text-center mb-6 text-sm text-gray-500'>Welcome to Wearero! Please enter your details below to create an account and get started.</p>
                <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Name</label>
                    <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all' 
                    placeholder='Enter your Name' />
                </div>
                <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
                    <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all' 
                    placeholder='Enter your email address' />
                </div>
                <div className='mb-4 '>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all' 
                    placeholder='Enter your password' />
                </div>
                <div className='mb-6'>
                    <p className='block text-sm font-medium text-gray-700 mb-2'>Account Type</p>
                    <div className='flex flex-col gap-2 sm:flex-row'>
                        <label className={`flex flex-1 flex-col gap-2 border rounded-lg p-3 cursor-pointer transition-all hover:bg-gray-50 ${role === 'customer' ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200'}`}>
                            <div className='flex items-center gap-2'>
                                <input
                                    type="radio"
                                    name="role"
                                    value="customer"
                                    checked={role === 'customer'}
                                    onChange={(e) => setRole(e.target.value)}
                                    className='accent-black'
                                />
                                <span className='font-medium text-sm'>Customer</span>
                            </div>
                            <p className='text-xs text-gray-500 mt-1'>Shop products, track orders, and manage your profile.</p>
                        </label>
                        <label className={`flex flex-1 flex-col gap-2 border rounded-lg p-3 cursor-pointer transition-all hover:bg-gray-50 ${role === 'admin' ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200'}`}>
                            <div className='flex items-center gap-2'>
                                <input
                                    type="radio"
                                    name="role"
                                    value="admin"
                                    checked={role === 'admin'}
                                    onChange={(e) => setRole(e.target.value)}
                                    className='accent-black'
                                />
                                <span className='font-medium text-sm'>Admin</span>
                            </div>
                            <p className='text-xs text-gray-500 mt-1'>Manage catalog, orders, fulfillment, and other users.</p>
                        </label>
                    </div>
                </div>
                <button type='submit' disabled={isSubmitting} className='w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md'>
                    {isSubmitting ? 'Creating account...' : 'Sign Up'}
                </button>
                <p className='mt-6 text-center text-sm text-gray-600'>
                    Already have an account? {" "}
                    <Link to='/login' className='text-black font-semibold hover:underline'>Login</Link>
                    </p>
            </form>
        </div>

    <div className='hidden md:block w-1/2 bg-gray-800'>
        <div className='h-full flex flex-col justify-center items-center'>
            <img src={register} alt="Register to Account" className='h-full w-full object-cover'  />
        </div>
    </div>

    </div>
  )
}

export default Register