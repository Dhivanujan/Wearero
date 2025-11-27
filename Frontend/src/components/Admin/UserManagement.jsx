import React, { useEffect, useState } from 'react'

const UserManagement = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/users', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const [formData, setFormData] =  useState({
        name: "",
        email: "",
        password: "",
        role: "customer", //Default role
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                fetchUsers();
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    role: "customer"
                });
            }
        } catch (error) {
            console.error("Error adding user:", error);
        }
    }

    const handleRoleChange = async (userId, newRole) => {
       try {
           const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
               method: 'PUT',
               headers: {
                   'Content-Type': 'application/json',
                   Authorization: `Bearer ${localStorage.getItem('token')}`
               },
               body: JSON.stringify({ role: newRole })
           });
           if (response.ok) {
               fetchUsers();
           }
       } catch (error) {
           console.error("Error updating role:", error);
       }
    }

    const handleDeleteUser = async (userId) => {
       if(window.confirm("Are you sure you want to delete the User? ")){
           try {
               const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
                   method: 'DELETE',
                   headers: {
                       Authorization: `Bearer ${localStorage.getItem('token')}`
                   }
               });
               if (response.ok) {
                   fetchUsers();
               }
           } catch (error) {
               console.error("Error deleting user:", error);
           }
       }
    }
  return (
    <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">User Management</h2>
        {/* {Add new user form} */}
        <div className="p-6 rounded-lg mb-6">
            <h3 className="text-lg font-bold mb-4">Add New User</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className='block text-gray-700'>Name</label>
                    <input type="text"
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    className='w-full p-2 border rounded' />
                </div>
                <div className="mb-4">
                    <label className='block text-gray-700'>Email</label>
                    <input type="email"
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    className='w-full p-2 border rounded' />
                </div>
                <div className="mb-4">
                    <label className='block text-gray-700'>Password</label>
                    <input type="password"
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    className='w-full p-2 border rounded' />
                </div>
                <div className="mb-4">
                    <label className='block text-gray-700'>Role</label>
                    <select name="role" value={formData.role} onChange={handleChange} className='w-full p-2 border rounded'>
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type='submit' className='bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600'>Add User</button>
            </form>
        </div>
        {/* {User list Management} */}
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="min-w-full text-left text-gray-500">
                <thead className='bg-gray-100text-cs uppercase text-gray-700'>
                    <th className='py-3 px-4'>Name</th>
                    <th className='py-3 px-4'>Email</th>
                    <th className='py-3 px-4'>Role</th>
                    <th className='py-3 px-4'>Actions</th>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id} className='border-b hover:bg-gray-50'>
                            <td className='p-4 font-medium text-gray-900 whitespace-nowrap'>{user.name}</td>
                            <td className='p-4'>{user.email}</td>
                            <td className='p-4'>
                                <select 
                                value={user.role}
                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                className='p-2 border rounded'>
                                    <option value="customer">Customer</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </td>
                            <td className='p-4'>
                                <button onClick={() => handleDeleteUser(user._id)} className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>

    
  )
}

export default UserManagement