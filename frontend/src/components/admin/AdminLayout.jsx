import React from 'react';
import AdminSidebar from './AdminSidebar';
import { BookOpen } from 'lucide-react';

function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-royal-900">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        {/* Admin Header Bar */}
        <div className="bg-surface/80 backdrop-blur-md border-b border-gold/20 px-8 py-4">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-6 h-6 text-gold" />
            <span className="text-xl font-cinzel-decorative font-bold text-gold">Admin Dashboard</span>
          </div>
        </div>
        
        {/* Page content renders here */}
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;