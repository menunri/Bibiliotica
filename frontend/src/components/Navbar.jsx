import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { notificationService } from '../services/api.service';
import { BookOpen, Bell, User, LogOut, Menu, X, Sun, Moon } from 'lucide-react';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [hasUnread, setHasUnread] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      notificationService.getUnreadCount().then(data => {
        setHasUnread(data.count > 0);
      }).catch(() => {});
    }
  }, [isAuthenticated]);

  return (
    <nav className="bg-surface border-b-2 border-gold/30 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative group-hover:scale-110 transition-transform">
              <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
            </div>
            <span className="text-2xl font-bold font-cinzel-decorative text-gold tracking-wide">
              Bibliotica
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/books"
              className="flex items-center space-x-2 text-gold/80 hover:text-gold transition-all duration-300 font-cinzel"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse</span>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/my-borrows"
                  className="text-gold/80 hover:text-gold transition-all duration-300 font-cinzel"
                >
                  My Library
                </Link>
                <Link
                  to="/requests"
                  className="text-gold/80 hover:text-gold transition-all duration-300 font-cinzel"
                >
                  Requests
                </Link>
                <Link
                  to="/notifications"
                  className="relative p-2 text-gold/80 hover:text-gold transition-all duration-300"
                >
                  <Bell className="w-5 h-5" />
                  {hasUnread && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-magical-teal rounded-full animate-pulse"></span>
                  )}
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gold/80 hover:text-gold transition-all duration-300"
                >
                  <User className="w-4 h-4" />
                  <span className="font-cinzel">{user?.username}</span>
                </Link>
                {user?.admin_id && (
                  <Link
                    to="/admin/dashboard"
                    className="bg-gold/20 border border-gold text-gold px-4 py-2 rounded-lg hover:bg-gold hover:text-royal-900 transition-all duration-300 font-cinzel"
                  >
                    Admin
                  </Link>
                )}
                
                {/* Theme Toggle Button */}
                <button
                  onClick={toggleTheme}
                  className="theme-toggle"
                  title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span className="font-cinzel text-sm">{theme === 'dark' ? 'Light' : 'Dark'}</span>
                </button>
                
                <button
                  onClick={() => { logout(); }}
                  className="flex items-center space-x-2 text-gold/60 hover:text-red-400 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-cinzel">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gold/80 hover:text-gold transition-all duration-300 font-cinzel"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gold-300 text-stone-900 px-5 py-2 rounded-lg hover:bg-gold-600 transition-all duration-300 font-cinzel font-semibold shadow-gold"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gold p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gold/20">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/books" 
                className="flex items-center space-x-2 text-gold/80 hover:text-gold transition-all font-cinzel"
                onClick={() => setMobileMenuOpen(false)}
              >
                <BookOpen className="w-4 h-4" />
                <span>Browse Books</span>
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/my-borrows" 
                    className="text-gold/80 hover:text-gold transition-all font-cinzel"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Library
                  </Link>
                  <Link 
                    to="/requests" 
                    className="text-gold/80 hover:text-gold transition-all font-cinzel"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Requests
                  </Link>
                  <Link 
                    to="/notifications" 
                    className="flex items-center space-x-2 text-gold/80 hover:text-gold transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Bell className="w-4 h-4" />
                    <span>Notifications</span>
                    {hasUnread && <span className="w-2 h-2 bg-magical-teal rounded-full"></span>}
                  </Link>
                  <Link 
                    to="/profile" 
                    className="flex items-center space-x-2 text-gold/80 hover:text-gold transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>{user?.username}</span>
                  </Link>
                  {user?.admin_id && (
                    <Link 
                      to="/admin/dashboard" 
                      className="text-gold font-cinzel"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="flex items-center space-x-2 text-red-400 hover:text-red-300"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-gold/80 hover:text-gold transition-all font-cinzel"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-gold-300 text-stone-900 px-4 py-2 rounded-lg text-center font-cinzel font-semibold hover:bg-gold-600 transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;