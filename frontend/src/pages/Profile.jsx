import React, { useState, useEffect } from 'react';
import { userService } from '../services/api.service';
import AuthService from '../services/auth.service';
import { User, Mail, Phone, MapPin, Calendar, Edit3, Save, X, BookOpen, Bell } from 'lucide-react';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    mobile_number: '',
    address: ''
  });

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await userService.getProfile();
      setProfile(data);
      setFormData({
        username: data.username || '',
        email: data.email || '',
        mobile_number: data.mobile_number || '',
        address: data.address || ''
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await userService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.updateProfile(formData);
      alert('Profile updated successfully!');
      setEditing(false);
      fetchProfile();
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="spinner mx-auto mb-4"></div>
        <p className="text-gold/60 font-cinzel">Loading profile...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-4">
            <User className="w-10 h-10 text-gold" />
          </div>
          <h1 className="text-4xl font-bold font-cinzel-decorative text-gold mb-2">{profile?.username}</h1>
          <p className="text-gold/60 font-cinzel">Library Member</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex justify-between items-center mb-8 border-b border-gold/20 pb-4">
                <h2 className="text-xl font-cinzel font-semibold text-gold flex items-center">
                  <Edit3 className="w-5 h-5 mr-2" />
                  Personal Information
                </h2>
                <button
                  onClick={() => setEditing(!editing)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-cinzel font-semibold transition-all ${
                    editing 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30' 
                      : 'bg-gold/20 text-gold border border-gold/50 hover:bg-gold/30'
                  }`}
                >
                  {editing ? (
                    <>
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4" />
                      <span>Edit</span>
                    </>
                  )}
                </button>
              </div>

              {editing ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-cinzel text-gold/80">Username</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/50" />
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-royal-800/50 border border-gold/30 rounded-lg focus:border-gold focus:ring-gold/20 focus:outline-none font-cinzel text-gold"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-cinzel text-gold/80">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/50" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-royal-800/50 border border-gold/30 rounded-lg focus:border-gold focus:ring-gold/20 focus:outline-none font-cinzel text-gold"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-cinzel text-gold/80">Mobile Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/50" />
                      <input
                        type="text"
                        value={formData.mobile_number}
                        onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-royal-800/50 border border-gold/30 rounded-lg focus:border-gold focus:ring-gold/20 focus:outline-none font-cinzel text-gold"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-cinzel text-gold/80">Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 w-5 h-5 text-gold/50" />
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-royal-800/50 border border-gold/30 rounded-lg focus:border-gold focus:ring-gold/20 focus:outline-none font-cinzel text-gold resize-none"
                        rows={3}
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary w-full flex items-center justify-center space-x-2 mt-6">
                    <Save className="w-5 h-5" />
                    <span>Save Changes</span>
                  </button>
                </form>
              ) : (
                <div className="space-y-5">
                  <div className="flex justify-between items-center py-3 border-b border-gold/10">
                    <span className="text-gold/60 font-cinzel flex items-center gap-2">
                      <User className="w-4 h-4" /> Username
                    </span>
                    <span className="font-cinzel font-semibold text-gold">{profile?.username}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gold/10">
                    <span className="text-gold/60 font-cinzel flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Email
                    </span>
                    <span className="font-cinzel font-semibold text-gold">{profile?.email}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gold/10">
                    <span className="text-gold/60 font-cinzel flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Mobile
                    </span>
                    <span className="font-cinzel font-semibold text-gold">{profile?.mobile_number || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gold/10">
                    <span className="text-gold/60 font-cinzel flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Address
                    </span>
                    <span className="font-cinzel font-semibold text-gold">{profile?.address || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gold/60 font-cinzel flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Member Since
                    </span>
                    <span className="font-cinzel font-semibold text-gold">{new Date(profile?.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats Card */}
          <div>
            <div className="card h-full">
              <h2 className="text-xl font-cinzel font-semibold text-gold mb-6 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Library Stats
              </h2>
              <div className="space-y-6">
                <div className="card bg-royal-800/50 p-5 rounded-lg text-center">
                  <BookOpen className="w-10 h-10 text-gold/50 mx-auto mb-3" />
                  <p className="text-4xl font-cinzel-decorative font-bold text-gold mb-1">{stats?.borrowed_books || 0}</p>
                  <p className="text-gold/50 font-cinzel text-sm">Borrowed Books</p>
                </div>
                <div className="card bg-royal-800/50 p-5 rounded-lg text-center">
                  <Bell className="w-10 h-10 text-gold/50 mx-auto mb-3" />
                  <p className="text-4xl font-cinzel-decorative font-bold text-gold mb-1">{stats?.unread_notifications || 0}</p>
                  <p className="text-gold/50 font-cinzel text-sm">Unread Notifications</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;