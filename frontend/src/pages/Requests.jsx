import React, { useState } from 'react';
import { requestService } from '../services/api.service';
import { BookOpen, Plus, Search, X, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    published_year: '',
    genre: ''
  });

  React.useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await requestService.getMyRequests();
      setRequests(data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestService.create(formData);
      alert('Request submitted successfully!');
      setFormData({ title: '', author: '', published_year: '', genre: '' });
      setShowForm(false);
      fetchRequests();
    } catch (error) {
      alert('Failed to submit request');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-gold/20 text-gold border border-gold/50';
      case 'accepted': return 'bg-magical-teal/20 text-magical-teal border border-magical-teal/50';
      case 'rejected': return 'bg-red-500/20 text-red-400 border border-red-500/50';
      default: return 'bg-gold/20 text-gold border border-gold/50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredRequests = requests.filter(request => {
    const searchLower = search.toLowerCase();
    return (
      request.title?.toLowerCase().includes(searchLower) ||
      request.author?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="spinner mx-auto mb-4"></div>
        <p className="text-gold/60 font-cinzel">Loading requests...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold font-cinzel-decorative text-gold mb-3">Book Requests</h1>
          <p className="text-gold/60 font-cinzel">Request books not currently in our collection</p>
        </div>

        {/* Search and Add Button */}
        <div className="flex flex-wrap gap-4 mb-8 max-w-2xl mx-auto">
          <div className="flex-1 relative min-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/50" />
            <input
              type="text"
              placeholder="Search requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-surface border border-gold/30 rounded-lg focus:border-gold focus:ring-gold/20 focus:outline-none font-cinzel text-gold placeholder:text-gold/40"
            />
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-cinzel font-semibold transition-all ${
              showForm 
                ? 'bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30' 
                : 'bg-gold text-gold hover:bg-gold-light shadow-gold'
            }`}
          >
            {showForm ? (
              <>
                <X className="w-5 h-5" />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>New Request</span>
              </>
            )}
          </button>
        </div>

        {/* Request Form */}
        {showForm && (
          <div className="card mb-10 max-w-2xl mx-auto">
            <h2 className="text-xl font-cinzel font-semibold text-gold mb-6 flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Request a Book
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-sm font-cinzel text-gold/80">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-royal-800/50 border border-gold/30 rounded-lg focus:border-gold focus:ring-gold/20 focus:outline-none font-cinzel text-gold placeholder:text-gold/40"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-cinzel text-gold/80">Author *</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-3 bg-royal-800/50 border border-gold/30 rounded-lg focus:border-gold focus:ring-gold/20 focus:outline-none font-cinzel text-gold placeholder:text-gold/40"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-cinzel text-gold/80">Published Year</label>
                  <input
                    type="number"
                    value={formData.published_year}
                    onChange={(e) => setFormData({ ...formData, published_year: e.target.value })}
                    className="w-full px-4 py-3 bg-royal-800/50 border border-gold/30 rounded-lg focus:border-gold focus:ring-gold/20 focus:outline-none font-cinzel text-gold placeholder:text-gold/40"
                    placeholder="e.g. 2023"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-cinzel text-gold/80">Genre</label>
                  <select
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="w-full px-4 py-3 bg-royal-800/50 border border-gold/30 rounded-lg focus:border-gold focus:ring-gold/20 focus:outline-none font-cinzel text-gold appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-royal-800">Select Genre</option>
                    <option value="Fiction" className="bg-royal-800">Fiction</option>
                    <option value="Non-Fiction" className="bg-royal-800">Non-Fiction</option>
                    <option value="Science" className="bg-royal-800">Science</option>
                    <option value="History" className="bg-royal-800">History</option>
                    <option value="Fantasy" className="bg-royal-800">Fantasy</option>
                    <option value="Biography" className="bg-royal-800">Biography</option>
                    <option value="Technology" className="bg-royal-800">Technology</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-primary w-full mt-6">
                Submit Request
              </button>
            </form>
          </div>
        )}

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <div className="text-center py-20 card max-w-md mx-auto">
            <BookOpen className="w-20 h-20 text-gold/30 mx-auto mb-4" />
            <p className="text-gold/60 font-cinzel text-lg mb-2">No requests found</p>
            <p className="text-gold/40 font-cinzel text-sm">Make a request to add new books to the collection</p>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto">
            {filteredRequests.map(request => (
              <div key={request.request_id} className="card flex justify-between items-center hover:border-gold/50 transition-all">
                <div className="flex-1">
                  <h3 className="font-cinzel font-semibold text-lg text-gold">{request.title}</h3>
                  <p className="text-gold/60 font-cinzel">by {request.author}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-gold/50 font-cinzel text-sm">
                    {request.genre && (
                      <span className="badge">{request.genre}</span>
                    )}
                    {request.published_year && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {request.published_year}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(request.request_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <span className={`flex items-center space-x-2 px-4 py-2 rounded-full font-cinzel font-semibold ${getStatusColor(request.status)}`}>
                  {getStatusIcon(request.status)}
                  <span>{request.status}</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Requests;