import React, { useState, useEffect } from 'react';
import AuthService from '../services/auth.service';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = AuthService.getUser();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  const statCards = [
    { label: 'Total Users', value: stats?.total_users || 0, icon: '👥', color: 'bg-blue-500' },
    { label: 'Total Books', value: stats?.total_books || 0, icon: '📚', color: 'bg-green-500' },
    { label: 'Borrowed', value: stats?.currently_borrowed || 0, icon: '📖', color: 'bg-yellow-500' },
    { label: 'Returned', value: stats?.total_returned || 0, icon: '✅', color: 'bg-purple-500' },
    { label: 'Pending Requests', value: stats?.pending_requests || 0, icon: '⏳', color: 'bg-orange-500' },
    { label: 'Unread Notifications', value: stats?.unread_notifications || 0, icon: '🔔', color: 'bg-red-500' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/admin/books" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <span className="text-2xl">📚</span>
              <p className="font-medium mt-2">Manage Books</p>
            </a>
            <a href="/admin/users" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <span className="text-2xl">👥</span>
              <p className="font-medium mt-2">Manage Users</p>
            </a>
            <a href="/admin/requests" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <span className="text-2xl">📋</span>
              <p className="font-medium mt-2">Book Requests</p>
            </a>
            <a href="/admin/borrows" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <span className="text-2xl">📖</span>
              <p className="font-medium mt-2">Borrow Records</p>
            </a>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">System Info</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Admin User</span>
              <span className="font-medium">{user?.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Database</span>
              <span className="font-medium">Supabase</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Backend</span>
              <span className="font-medium">Node.js + Express</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Frontend</span>
              <span className="font-medium">React + Vite</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;