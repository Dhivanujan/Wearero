import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UserLayout from './components/Layout/UserLayout'
import Home from './pages/Home'
import { Toaster } from 'sonner'
import Login from "./pages/Login"
import Register from './pages/Register'
import Profile from './pages/Profile'
import CollectionPage from './pages/CollectionPage'
import ProductDetails from './components/Products/ProductDetails'
import Checkout from './components/Cart/Checkout'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import OrderDetailsPage from './pages/OrderDetailsPage'
import MyOrdersPage from './pages/MyOrdersPage'
import AdminOutlet from './components/Admin/Outlet'
import AdminHomePage from './pages/AdminHomePage'
import UserManagement from './components/Admin/UserManagement'
import ProductManagement from './components/Admin/ProductManagement'
import EditProductPage from './components/Admin/EditProductPage'
import OrderManagement from './components/Admin/OrderManagement'
import { CartProvider } from './context/CartContext'
import ProtectedRoute from './components/Common/ProtectedRoute'
import WishlistPage from './pages/WishlistPage'

const App = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <Toaster position='top-right' />
        <Routes>
          <Route path='/' element={<UserLayout/>}>
            <Route index element={<Home/>}/>
            <Route path='login' element={<Login />}/>
            <Route path='register' element={<Register/>}/>
            <Route path='profile' element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
            <Route path='wishlist' element={<ProtectedRoute><WishlistPage/></ProtectedRoute>}/>
            <Route path='collections/:collection' element={<CollectionPage/>}/>
            <Route path='product/:id' element={<ProductDetails/>}/>
            <Route path='checkout' element={<ProtectedRoute><Checkout/></ProtectedRoute>}/>
            <Route path='order-confirmation' element={<ProtectedRoute><OrderConfirmationPage/></ProtectedRoute>}/>
            <Route path='order/:id' element={<ProtectedRoute><OrderDetailsPage/></ProtectedRoute>}/>
            <Route path='my-orders' element={<ProtectedRoute><MyOrdersPage/></ProtectedRoute>}/>
          </Route>
          <Route path='/admin' element={<AdminOutlet/>}>
            <Route index element={<AdminHomePage/>}/>
            <Route path="users" element={<UserManagement/>}/>
            <Route path="products" element={<ProductManagement/>}/>
            <Route path="products/:id/edit" element={<EditProductPage/>}/>
            <Route path="products/new" element={<EditProductPage/>}/>
            <Route path="orders" element={<OrderManagement/>}/>
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App