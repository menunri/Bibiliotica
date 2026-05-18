import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, BookOpen, Users, FileText, Inbox, BookMarked, LogOut
} from 'lucide-react';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/books', label: 'Manage Books', icon: BookOpen },
  { to: '/admin/users', label: 'Manage Users', icon: Users },
  { to: '/admin/requests', label: 'Book Requests', icon: FileText },
  { to: '/admin/borrow-requests', label: 'Borrow Requests', icon: Inbox },
  { to: '/admin/borrows', label: 'Borrow Records', icon: BookMarked },
];

function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="w-64 bg-surface min-h-screen fixed left-0 top-0 flex flex-col border-r border-gold/20">
      {/* Header with Logo and Admin Name */}
      <div className="p-6 border-b border-gold/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="font-cinzel-decorative font-bold text-gold text-lg">Bibliotica</h1>
            <p className="text-gold/60 font-cinzel text-xs">Admin Panel</p>
          </div>
        </div>
        {user && (
          <div className="pt-4 border-t border-gold/10">
            <p className="font-cinzel font-semibold text-gold">{user.username}</p>
            <p className="text-gold/50 font-cinzel text-xs truncate">{user.email}</p>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-gold/20 text-gold border border-gold/30'
                        : 'text-gold/60 hover:bg-gold/10 hover:text-gold border border-transparent'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-cinzel font-medium">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer with Logout */}
      <div className="p-4 border-t border-gold/20">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-gold/60 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-all duration-300"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-cinzel font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;
