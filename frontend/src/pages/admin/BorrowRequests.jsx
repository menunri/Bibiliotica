import React, { useState, useEffect } from 'react';
import { borrowRequestService } from '../../services/api.service';
import {
  FileText, CheckCircle, XCircle, Clock, Search,
  AlertTriangle, BookOpen, User, Calendar, Check, X
} from 'lucide-react';

function AdminBorrowRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('pending');
  const [search, setSearch] = useState('');
  const [processing, setProcessing] = useState(null);
  const [rejectNotes, setRejectNotes] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await borrowRequestService.getAllRequests();
      setRequests(data || []);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      setError('Failed to load borrow requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setProcessing(id);
    try {
      const result = await borrowRequestService.approve(id);
      if (result.error) {
        alert(result.error);
      } else {
        alert('Request approved successfully!');
        fetchRequests();
      }
    } catch (error) {
      alert('Failed to approve request');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    setProcessing(selectedRequest.request_id);
    try {
      const result = await borrowRequestService.reject(selectedRequest.request_id, rejectNotes);
      if (result.error) {
        alert(result.error);
      } else {
        alert('Request rejected');
        setShowRejectModal(false);
        setRejectNotes('');
        setSelectedRequest(null);
        fetchRequests();
      }
    } catch (error) {
      alert('Failed to reject request');
    } finally {
      setProcessing(null);
    }
  };

  const openRejectModal = (request) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
      approved: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      rejected: 'bg-red-500/20 text-red-400 border border-red-500/30'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium font-cinzel ${styles[status] || 'bg-gray-100'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredRequests = requests.filter(r => {
    const statusMatch = filter === 'all' || r.status === filter;
    if (!statusMatch) return false;
    
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        r.books?.title?.toLowerCase().includes(searchLower) ||
        r.books?.author?.toLowerCase().includes(searchLower) ||
        r.users?.full_name?.toLowerCase().includes(searchLower) ||
        r.users?.email?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400"></div>
    </div>
  );

  if (error) return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      <div className="text-center py-12 card border border-red-500/30">
        <AlertTriangle size={64} className="text-red-400 mx-auto" />
        <p className="mt-4 text-red-400 font-medium font-cinzel">{error}</p>
        <button
          onClick={fetchRequests}
          className="mt-4 btn-primary"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gold-400 font-cinzel-decorative flex items-center gap-3">
          <FileText size={32} />
          Borrow Requests
        </h1>
        <div className="flex gap-2">
          {['pending', 'approved', 'rejected', 'all'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium font-cinzel transition-all ${
                filter === f
                  ? 'bg-gold-400 text-royal-900'
                  : 'bg-gold-400/10 text-gold-400/70 hover:bg-gold-400/20'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== 'all' && (
                <span className="ml-2 text-xs opacity-70">
                  ({requests.filter(r => r.status === f).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-400/50" size={20} />
        <input
          type="text"
          placeholder="Search by book title, author, user name, or email..."
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
        <div className="card border border-gold-400/20 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gold-400/10">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-gold-400 font-cinzel">Book</th>
                <th className="text-left px-6 py-4 font-semibold text-gold-400 font-cinzel">User</th>
                <th className="text-left px-6 py-4 font-semibold text-gold-400 font-cinzel">Request Date</th>
                <th className="text-left px-6 py-4 font-semibold text-gold-400 font-cinzel">Status</th>
                <th className="text-left px-6 py-4 font-semibold text-gold-400 font-cinzel">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-400/10">
              {filteredRequests.map(request => (
                <tr key={request.request_id} className="hover:bg-gold-400/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-16 bg-gold-400/10 rounded flex items-center justify-center">
                        {request.books?.cover_image_url ? (
                          <img src={request.books.cover_image_url} alt="" className="h-full object-cover rounded" />
                        ) : (
                          <BookOpen size={20} className="text-gold-400/40" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{request.books?.title || 'Unknown'}</p>
                        <p className="text-sm text-gold-400/60">{request.books?.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-magical-teal" />
                      <div>
                        <p className="font-medium text-white">{request.users?.full_name || 'Unknown'}</p>
                        <p className="text-sm text-gold-400/60">{request.users?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gold-400/60 font-cinzel text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {new Date(request.request_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(request.status)}
                  </td>
                  <td className="px-6 py-4">
                    {request.status === 'pending' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(request.request_id)}
                          disabled={processing === request.request_id}
                          className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-sm hover:bg-emerald-500/30 transition-colors flex items-center gap-1"
                        >
                          <Check size={14} />
                          {processing === request.request_id ? 'Processing...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => openRejectModal(request)}
                          disabled={processing === request.request_id}
                          className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm hover:bg-red-500/30 transition-colors flex items-center gap-1"
                        >
                          <X size={14} />
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-gold-400/40 font-cinzel">
                        {request.admin_id ? `By ${request.admin_id}` : 'N/A'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="card bg-surface border border-gold-400/30 p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4 text-gold-400 font-cinzel flex items-center gap-2">
              <XCircle size={24} className="text-red-400" />
              Reject Borrow Request
            </h3>
            <p className="text-gold-400/70 mb-4">
              Are you sure you want to reject the borrow request for "{selectedRequest?.books?.title}"?
            </p>
            <div className="mb-4">
              <label className="block text-gold-400/80 font-medium mb-2">Reason (optional):</label>
              <textarea
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                className="input resize-none"
                rows="3"
                placeholder="Enter reason for rejection..."
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectNotes('');
                  setSelectedRequest(null);
                }}
                className="px-4 py-2 bg-gold-400/10 text-gold-400/70 rounded-lg hover:bg-gold-400/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={processing}
                className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50"
              >
                {processing ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBorrowRequests;