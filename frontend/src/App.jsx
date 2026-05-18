import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLogin from './pages/AdminLogin';
import Books from './pages/Books';
import BookDetails from './pages/BookDetails';
import MyBorrows from './pages/MyBorrows';
import Requests from './pages/Requests';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Orders from './pages/Orders';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminBooks from './pages/admin/Books';
import AdminUsers from './pages/admin/Users';
import AdminRequests from './pages/admin/Requests';
import AdminBorrowRequests from './pages/admin/BorrowRequests';
import AdminBorrows from './pages/admin/Borrows';

// Components
import Navbar from './components/Navbar';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Helper component to conditionally show Navbar
function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/books" element={<Books />} />
        <Route path="/books/:id" element={<BookDetails />} />

        {/* Protected User Routes */}
        <Route path="/my-borrows" element={
          <ProtectedRoute><MyBorrows /></ProtectedRoute>
        } />
        <Route path="/requests" element={
          <ProtectedRoute><Requests /></ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute><Notifications /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute><Orders /></ProtectedRoute>
        } />

        {/* Protected Admin Routes - wrapped in AdminLayout */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute adminOnly>
            <AdminLayout><AdminDashboard /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/books" element={
          <ProtectedRoute adminOnly>
            <AdminLayout><AdminBooks /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute adminOnly>
            <AdminLayout><AdminUsers /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/requests" element={
          <ProtectedRoute adminOnly>
            <AdminLayout><AdminRequests /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/borrows" element={
          <ProtectedRoute adminOnly>
            <AdminLayout><AdminBorrows /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/borrow-requests" element={
          <ProtectedRoute adminOnly>
            <AdminLayout><AdminBorrowRequests /></AdminLayout>
          </ProtectedRoute>
        } />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <AppContent />
      </div>
    </BrowserRouter>
  );
}

export default App;