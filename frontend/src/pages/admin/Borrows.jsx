import React, { useState, useEffect } from 'react';
import AuthService from '../../services/auth.service';
import { BookMarked, Search, Calendar, Clock, CheckCircle, BookOpen } from 'lucide-react';

function AdminBorrows() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  const fetchBorrowedBooks = async () => {
    try {
      const response = await fetch('/api/borrow/all', {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` }
      });
      const data = await response.json();
      setBorrowedBooks(data);
    } catch (error) {
      console.error('Failed to fetch borrowed books:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBorrows = borrowedBooks.filter(item => {
    const searchLower = search.toLowerCase();
    return (
      item.books?.title?.toLowerCase().includes(searchLower) ||
      item.books?.author?.toLowerCase().includes(searchLower) ||
      item.users?.username?.toLowerCase().includes(searchLower) ||
      item.users?.email?.toLowerCase().includes(searchLower)
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
        <BookMarked size={32} />
        Borrow Records
      </h1>

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

      {filteredBorrows.length === 0 ? (
        <div className="text-center py-12 card border border-gold-400/20">
          <BookOpen size={64} className="text-gold-400/30 mx-auto" />
          <p className="mt-4 text-gold-400/60 font-cinzel">No borrowed books records found.</p>
        </div>
      ) : (
        <div className="card border border-gold-400/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gold-400/10">
                <tr>
                  <th className="px-4 py-3 text-left text-gold-400 font-cinzel">Book</th>
                  <th className="px-4 py-3 text-left text-gold-400 font-cinzel">User</th>
                  <th className="px-4 py-3 text-left text-gold-400 font-cinzel">Borrow Date</th>
                  <th className="px-4 py-3 text-left text-gold-400 font-cinzel">Due Date</th>
                  <th className="px-4 py-3 text-left text-gold-400 font-cinzel">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredBorrows.map(item => (
                  <tr key={item.borrow_id} className="border-t border-gold-400/10 hover:bg-gold-400/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <BookOpen size={16} className="text-magical-teal" />
                        <div>
                          <p className="font-medium text-white">{item.books?.title || 'Unknown'}</p>
                          <p className="text-sm text-gold-400/60">{item.books?.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-white">{item.users?.username}</p>
                        <p className="text-sm text-gold-400/60">{item.users?.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gold-400/60 font-cinzel text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(item.borrow_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gold-400/60 font-cinzel text-sm">
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        {new Date(item.return_due_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {item.is_borrowed ? (
                        <span className="text-amber-400 font-medium flex items-center gap-1">
                          <Clock size={14} /> Borrowed
                        </span>
                      ) : (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle size={14} /> Returned
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBorrows;