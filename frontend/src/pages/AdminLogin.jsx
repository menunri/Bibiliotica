import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminLogin() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { adminLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await adminLogin(formData.username, formData.password);
      if (result.error) {
        setError(result.error);
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError('Admin login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <div className="form-container w-full max-w-md">
        <h2 className="text-2xl font-cinzel font-bold text-center mb-6 text-gold">Admin Login</h2>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-cinzel text-gold/80">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gold/30 rounded-lg focus:border-gold focus:ring-gold/20 focus:outline-none bg-[var(--input-bg)] text-[var(--text-primary)]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-cinzel text-gold/80">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gold/30 rounded-lg focus:border-gold focus:ring-gold/20 focus:outline-none bg-[var(--input-bg)] text-[var(--text-primary)]"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Admin Login'}
          </button>
        </form>

        <p className="text-center mt-4">
          <Link to="/login" className="text-gold/60 hover:text-gold transition-colors font-cinzel">← Back to User Login</Link>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;