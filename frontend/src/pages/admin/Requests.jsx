import React, { useState, useEffect } from 'react';
import AuthService from '../services/auth.service';

function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

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
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Book Requests</h1>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('accepted')}
          className={`px-4 py-2 rounded-lg ${filter === 'accepted' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
        >
          Accepted
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`px-4 py-2 rounded-lg ${filter === 'rejected' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
        >
          Rejected
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
        >
          All
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <span className="text-6xl">📋</span>
          <p className="mt-4">No requests found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(request => (
            <div key={request.request_id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{request.title}</h3>
                  <p className="text-gray-500">by {request.author}</p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-400">
                    {request.genre && <span>Genre: {request.genre}</span>}
                    {request.published_year && <span>Year: {request.published_year}</span>}
                    <span>Requested: {new Date(request.request_date).toLocaleDateString()}</span>
                  </div>
                  {request.users && (
                    <p className="text-sm text-gray-500 mt-2">
                      User: {request.users.username} ({request.users.email})
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAccept(request.request_id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(request.request_id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Reject
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