import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthService from './services/auth.service';

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
import Cart from './pages/Cart';
import Orders from './pages/Orders';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminBooks from './pages/admin/Books';
import AdminUsers from './pages/admin/Users';
import AdminRequests from './pages/admin/Requests';
import AdminBorrows from './pages/admin/Borrows';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const isAuthenticated = AuthService.isAuthenticated();
  const user = AuthService.getUser();
  const isAdmin = user?.admin_id;

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/cart" element={<Cart />} />

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

          {/* Protected Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/books" element={
            <ProtectedRoute adminOnly><AdminBooks /></ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>
          } />
          <Route path="/admin/requests" element={
            <ProtectedRoute adminOnly><AdminRequests /></ProtectedRoute>
          } />
          <Route path="/admin/borrows" element={
            <ProtectedRoute adminOnly><AdminBorrows /></ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;