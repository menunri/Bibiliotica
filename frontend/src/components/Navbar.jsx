import React from 'react';
import { Link } from 'react-router-dom';
import AuthService from './services/auth.service';

function Navbar() {
  const isAuthenticated = AuthService.isAuthenticated();
  const user = AuthService.getUser();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">📚</span>
            <span className="text-xl font-bold text-indigo-600">Bibliotica</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/books" className="text-gray-700 hover:text-indigo-600">Browse Books</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/my-borrows" className="text-gray-700 hover:text-indigo-600">My Borrows</Link>
                <Link to="/requests" className="text-gray-700 hover:text-indigo-600">Requests</Link>
                <Link to="/notifications" className="text-gray-700 hover:text-indigo-600">🔔</Link>
                <Link to="/cart" className="text-gray-700 hover:text-indigo-600">🛒</Link>
                <Link to="/profile" className="text-gray-700 hover:text-indigo-600">👤 {user?.username}</Link>
                {user?.admin_id && (
                  <Link to="/admin/dashboard" className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Admin</Link>
                )}
                <button 
                  onClick={() => { AuthService.logout(); window.location.href = '/'; }}
                  className="text-gray-700 hover:text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-indigo-600">Login</Link>
                <Link to="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;