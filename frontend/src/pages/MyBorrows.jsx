import React, { useState, useEffect } from 'react';
import { borrowService, borrowRequestService } from '../services/api.service';
import { BookOpen, ArrowLeft, Search, Calendar, Clock, RotateCcw, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

function MyBorrows() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('borrowed');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchBorrowedBooks();
    fetchBorrowRequests();
  }, []);

  const fetchBorrowedBooks = async () => {
    try {
      const data = await borrowService.getMyBorrows();
      setBorrowedBooks(data || []);
    } catch (error) {
      console.error('Failed to fetch borrowed books:', error);
    }
  };

  const fetchBorrowRequests = async () => {
    try {
      const data = await borrowRequestService.getMyRequests();
      setBorrowRequests(data || []);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (borrow_id) => {
    try {
      await borrowService.return(borrow_id);
      alert('Book returned successfully!');
      fetchBorrowedBooks();
    } catch (error) {
      alert('Failed to return book');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-gold/20 text-gold border border-gold/50',
      approved: 'bg-magical-teal/20 text-magical-teal border border-magical-teal/50',
      rejected: 'bg-red-500/20 text-red-400 border border-red-500/50'
    };
    const icons = {
      pending: <AlertCircle className="w-3 h-3" />,
      approved: <CheckCircle className="w-3 h-3" />,
      rejected: <XCircle className="w-3 h-3" />
    };
    return (
      <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-cinzel font-semibold ${styles[status] || styles.pending}`}>
        {icons[status]}
        <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
      </span>
    );
  };

  const filteredBorrowedBooks = borrowedBooks.filter(item => {
    const searchLower = search.toLowerCase();
    return (
      item.books?.title?.toLowerCase().includes(searchLower) ||
      item.books?.author?.toLowerCase().includes(searchLower)
    );
  });

  const filteredRequests = borrowRequests.filter(request => {
    const searchLower = search.toLowerCase();
    return (
      request.books?.title?.toLowerCase().includes(searchLower) ||
      request.books?.author?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="spinner mx-auto mb-4"></div>
        <p className="text-gold/60 font-cinzel">Loading your library...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold font-cinzel-decorative text-gold mb-3">My Library</h1>
          <p className="text-gold/60 font-cinzel">Manage your borrowed books and requests</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => setActiveTab('borrowed')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-cinzel font-semibold transition-all ${
              activeTab === 'borrowed'
                ? 'bg-gold text-gold shadow-gold'
                : 'bg-surface border border-gold/30 text-gold hover:border-gold'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>Borrowed ({borrowedBooks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-cinzel font-semibold transition-all ${
              activeTab === 'requests'
                ? 'bg-gold text-gold shadow-gold'
                : 'bg-surface border border-gold/30 text-gold hover:border-gold'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>Requests ({borrowRequests.length})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/50" />
            <input
              type="text"
              placeholder="Search by book title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-surface border border-gold/30 rounded-lg focus:border-gold focus:ring-gold/20 focus:outline-none font-cinzel text-gold placeholder:text-gold/40"
            />
          </div>
        </div>

        {activeTab === 'borrowed' ? (
          filteredBorrowedBooks.length === 0 ? (
            <div className="text-center py-20 card max-w-md mx-auto">
              <BookOpen className="w-20 h-20 text-gold/30 mx-auto mb-4" />
              <p className="text-gold/60 font-cinzel text-lg mb-2">No borrowed books</p>
              <p className="text-gold/40 font-cinzel text-sm">Visit the library to borrow your first book</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBorrowedBooks.map(item => (
                <div key={item.borrow_id} className="card flex items-center justify-between hover:border-gold/50 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-20 bg-royal-800 rounded-lg flex items-center justify-center overflow-hidden">
                      {item.books?.cover_image_url ? (
                        <img src={item.books.cover_image_url} alt={item.books?.title} className="h-full object-cover" />
                      ) : (
                        <BookOpen className="w-8 h-8 text-gold/30" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-cinzel font-semibold text-lg text-gold">{item.books?.title || 'Unknown Title'}</h3>
                      <p className="text-gold/60 font-cinzel">{item.books?.author}</p>
                      <div className="flex items-center gap-4 mt-2 text-gold/50 font-cinzel text-sm">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Borrowed: {new Date(item.borrow_date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Due: {new Date(item.return_due_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleReturn(item.borrow_id)}
                    className="flex items-center space-x-2 bg-gold text-gold px-5 py-2 rounded-lg font-cinzel font-semibold hover:bg-gold-light transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Return</span>
                  </button>
                </div>
              ))}
            </div>
          )
        ) : (
          filteredRequests.length === 0 ? (
            <div className="text-center py-20 card max-w-md mx-auto">
              <FileText className="w-20 h-20 text-gold/30 mx-auto mb-4" />
              <p className="text-gold/60 font-cinzel text-lg mb-2">No borrow requests</p>
              <p className="text-gold/40 font-cinzel text-sm">Browse books to make a borrow request</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map(request => (
                <div key={request.request_id} className="card flex items-center justify-between hover:border-gold/50 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-20 bg-royal-800 rounded-lg flex items-center justify-center overflow-hidden">
                      {request.books?.cover_image_url ? (
                        <img src={request.books.cover_image_url} alt={request.books?.title} className="h-full object-cover" />
                      ) : (
                        <BookOpen className="w-8 h-8 text-gold/30" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-cinzel font-semibold text-lg text-gold">{request.books?.title || request.title || 'Unknown Title'}</h3>
                      <p className="text-gold/60 font-cinzel">{request.books?.author || request.author}</p>
                      <div className="flex items-center gap-2 mt-2 text-gold/50 font-cinzel text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>Requested: {new Date(request.request_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(request.status)}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default MyBorrows;