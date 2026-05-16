import React, { useState, useEffect } from 'react';
import { borrowService } from '../services/api.service';

function MyBorrows() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  const fetchBorrowedBooks = async () => {
    try {
      const data = await borrowService.getMyBorrows();
      setBorrowedBooks(data);
    } catch (error) {
      console.error('Failed to fetch borrowed books:', error);
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

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Borrowed Books</h1>

      {borrowedBooks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <span className="text-6xl">📚</span>
          <p className="mt-4">You haven't borrowed any books yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {borrowedBooks.map(item => (
            <div key={item.borrow_id} className="card flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                  {item.books?.cover_image_url ? (
                    <img src={item.books.cover_image_url} alt={item.books?.title} className="h-full object-cover rounded-lg" />
                  ) : (
                    <span>📚</span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{item.books?.title || 'Unknown Title'}</h3>
                  <p className="text-gray-500">{item.books?.author}</p>
                  <p className="text-sm text-gray-400">
                    Borrowed: {new Date(item.borrow_date).toLocaleDateString()} | 
                    Due: {new Date(item.return_due_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleReturn(item.borrow_id)}
                className="btn-secondary"
              >
                Return Book
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBorrows;