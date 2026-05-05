import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserLayout from './components/Layout/UserLayout';
import Home from './pages/Home';
import { Toaster } from 'sonner';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Common/ProtectedRoute';

// Lazy-loaded pages for code splitting
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const CollectionPage = lazy(() => import('./pages/CollectionPage'));
const ProductDetails = lazy(() => import('./components/Products/ProductDetails'));
const Checkout = lazy(() => import('./components/Cart/Checkout'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage'));
const OrderDetailsPage = lazy(() => import('./pages/OrderDetailsPage'));
const MyOrdersPage = lazy(() => import('./pages/MyOrdersPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));

// Admin pages (heavy, always lazy)
const AdminOutlet = lazy(() => import('./components/Admin/Outlet'));
const AdminHomePage = lazy(() => import('./pages/AdminHomePage'));
const UserManagement = lazy(() => import('./components/Admin/UserManagement'));
const ProductManagement = lazy(() => import('./components/Admin/ProductManagement'));
const EditProductPage = lazy(() => import('./components/Admin/EditProductPage'));
const OrderManagement = lazy(() => import('./components/Admin/OrderManagement'));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-3 border-gray-200 dark:border-gray-700 border-t-accent rounded-full animate-spin" />
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Loading...</p>
    </div>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<UserLayout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
                <Route path="collections/:collection" element={<CollectionPage />} />
                <Route path="product/:id" element={<ProductDetails />} />
                <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="order-confirmation" element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>} />
                <Route path="order/:id" element={<ProtectedRoute><OrderDetailsPage /></ProtectedRoute>} />
                <Route path="my-orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
              </Route>
              <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminOutlet /></ProtectedRoute>}>
                <Route index element={<AdminHomePage />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="products" element={<ProductManagement />} />
                <Route path="products/:id/edit" element={<EditProductPage />} />
                <Route path="products/new" element={<EditProductPage />} />
                <Route path="orders" element={<OrderManagement />} />
              </Route>
            </Routes>
          </Suspense>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;