import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';
import { borrowService } from '../services/api.service';

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [borrowing, setBorrowing] = useState(false);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await fetch(`/api/books/${id}`);
      if (!response.ok) throw new Error('Book not found');
      const data = await response.json();
      setBook(data);
    } catch (err) {
      setError('Failed to load book');
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async () => {
    const user = AuthService.getUser();
    if (!user) {
      navigate('/login');
      return;
    }

    setBorrowing(true);
    try {
      const result = await borrowService.borrow(id);
      if (result.error) {
        alert(result.error);
      } else {
        alert('Book borrowed successfully!');
        navigate('/my-borrows');
      }
    } catch (err) {
      alert('Failed to borrow book');
    } finally {
      setBorrowing(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="card">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <div className="bg-gray-200 rounded-xl h-80 flex items-center justify-center">
              {book.cover_image_url ? (
                <img src={book.cover_image_url} alt={book.title} className="h-full object-cover rounded-xl" />
              ) : (
                <span className="text-8xl">📚</span>
              )}
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
            
            <div className="space-y-2 mb-6">
              <p><span className="font-semibold">Genre:</span> {book.genre}</p>
              <p><span className="font-semibold">Published:</span> {book.published_year}</p>
              <p><span className="font-semibold">Available:</span> 
                <span className={book.available > 0 ? 'text-green-600' : 'text-red-600'}>
                  {book.available} copies
                </span>
              </p>
            </div>

            {book.available > 0 ? (
              <button
                onClick={handleBorrow}
                disabled={borrowing}
                className="btn-primary disabled:opacity-50"
              >
                {borrowing ? 'Borrowing...' : 'Borrow This Book'}
              </button>
            ) : (
              <button disabled className="bg-gray-400 text-white px-6 py-2 rounded-lg cursor-not-allowed">
                Not Available
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;