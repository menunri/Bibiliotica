import React, { useState, useEffect } from 'react';
import AuthService from '../../services/auth.service';
import { FileText, Search, Check, X, Clock, BookOpen, User, Calendar } from 'lucide-react';

function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      const url = filter === 'all' ? '/api/requests/all' : `/api/requests/all?status=${filter}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` }
      });
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      const response = await fetch(`/api/requests/${id}/accept`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${AuthService.getToken()}` }
      });

      if (response.ok) {
        alert('Request accepted and book added to library!');
        fetchRequests();
      }
    } catch (error) {
      alert('Failed to accept request');
    }
  };

  const handleReject = async (id) => {
    if (!confirm('Are you sure you want to reject this request?')) return;

    try {
      const response = await fetch(`/api/requests/${id}/reject`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${AuthService.getToken()}` }
      });

      if (response.ok) {
        alert('Request rejected');
        fetchRequests();
      }
    } catch (error) {
      alert('Failed to reject request');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      case 'accepted': return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      default: return 'bg-gold-400/10 text-gold-400/60 border border-gold-400/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={14} />;
      case 'accepted': return <Check size={14} />;
      case 'rejected': return <X size={14} />;
      default: return <FileText size={14} />;
    }
  };

  const filteredRequests = requests.filter(request => {
    const statusMatch = filter === 'all' || request.status === filter;
    if (!statusMatch) return false;
    
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        request.title?.toLowerCase().includes(searchLower) ||
        request.author?.toLowerCase().includes(searchLower) ||
        request.genre?.toLowerCase().includes(searchLower) ||
        request.users?.username?.toLowerCase().includes(searchLower) ||
        request.users?.email?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      <h1 className="text-3xl font-bold text-gold-400 font-cinzel-decorative mb-8 flex items-center gap-3">
        <FileText size={32} />
        Book Requests
      </h1>

      <div className="flex gap-2 mb-6">
        {['pending', 'accepted', 'rejected', 'all'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-cinzel transition-all ${
              filter === f
                ? 'bg-gold-400 text-royal-900'
                : 'bg-gold-400/10 text-gold-400/70 hover:bg-gold-400/20'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-400/50" size={20} />
        <input
          type="text"
          placeholder="Search by book title, author, genre, or user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-12"
        />
      </div>

      {filteredRequests.length === 0 ? (
        <div className="text-center py-12 card border border-gold-400/20">
          <FileText size={64} className="text-gold-400/30 mx-auto" />
          <p className="mt-4 text-gold-400/60 font-cinzel">No {filter === 'all' ? '' : filter} requests found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map(request => (
            <div key={request.request_id} className="card border border-gold-400/20 hover:border-gold-400/40 transition-all">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-12 h-16 bg-gold-400/10 rounded flex items-center justify-center">
                    <BookOpen size={24} className="text-gold-400/40" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white">{request.title}</h3>
                    <p className="text-gold-400/60">by {request.author}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gold-400/40 font-cinzel">
                      {request.genre && <span>Genre: {request.genre}</span>}
                      {request.published_year && <span>Year: {request.published_year}</span>}
                      <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(request.request_date).toLocaleDateString()}</span>
                    </div>
                    {request.users && (
                      <p className="text-sm text-gold-400/60 mt-2 flex items-center gap-1">
                        <User size={14} /> {request.users.username} ({request.users.email})
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium font-cinzel flex items-center gap-1 ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)}
                    {request.status}
                  </span>
                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAccept(request.request_id)}
                        className="px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition-colors flex items-center gap-1"
                      >
                        <Check size={16} /> Accept
                      </button>
                      <button
                        onClick={() => handleReject(request.request_id)}
                        className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-1"
                      >
                        <X size={16} /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminRequests;