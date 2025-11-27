import React from 'react';
import ProtectedRoute from '../Common/ProtectedRoute';
import AdminLayout from './AdminLayout';

const AdminOutlet = () => (
  <ProtectedRoute requireAdmin>
    <AdminLayout />
  </ProtectedRoute>
);

export default AdminOutlet;
