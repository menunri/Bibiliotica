import React, { useState, useEffect } from 'react';
import AuthService from '../../services/auth.service';
import { Users, Search, UserCheck } from 'lucide-react';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` }
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = search.toLowerCase();
    return (
      user.username?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.user_id?.toString().includes(search)
    );
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      <h1 className="text-3xl font-bold text-gold-400 font-cinzel-decorative mb-8 flex items-center gap-3">
        <Users size={32} />
        User Management
      </h1>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-400/50" size={20} />
        <input
          type="text"
          placeholder="Search by username, email, or user ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-12"
        />
      </div>

      <div className="card border border-gold-400/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gold-400/10">
              <tr>
                <th className="px-4 py-3 text-left text-gold-400 font-cinzel">ID</th>
                <th className="px-4 py-3 text-left text-gold-400 font-cinzel">Username</th>
                <th className="px-4 py-3 text-left text-gold-400 font-cinzel">Email</th>
                <th className="px-4 py-3 text-left text-gold-400 font-cinzel">Mobile</th>
                <th className="px-4 py-3 text-left text-gold-400 font-cinzel">Address</th>
                <th className="px-4 py-3 text-left text-gold-400 font-cinzel">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.user_id} className="border-t border-gold-400/10 hover:bg-gold-400/5 transition-colors">
                  <td className="px-4 py-3 text-gold-400/60">{user.user_id}</td>
                  <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                    <UserCheck size={16} className="text-magical-teal" />
                    {user.username}
                  </td>
                  <td className="px-4 py-3 text-gold-400/80">{user.email}</td>
                  <td className="px-4 py-3 text-gold-400/80">{user.mobile_number || '-'}</td>
                  <td className="px-4 py-3 max-w-xs truncate text-gold-400/80">{user.address || '-'}</td>
                  <td className="px-4 py-3 text-gold-400/60 font-cinzel text-sm">{new Date(user.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gold-400/40 font-cinzel">No users found matching your search.</div>
        )}
      </div>
    </div>
  );
}

export default AdminUsers;