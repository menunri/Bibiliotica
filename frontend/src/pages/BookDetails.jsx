import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';
import { borrowRequestService } from '../services/api.service';

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

  const handleRequest = async () => {
    const user = AuthService.getUser();
    if (!user) {
      navigate('/login');
      return;
    }

    setBorrowing(true);
    try {
      const result = await borrowRequestService.create(id);
      if (result.error) {
        alert(result.error);
      } else {
        alert('Borrow request submitted! An admin will review it.');
        navigate('/my-borrows');
      }
    } catch (err) {
      alert('Failed to submit borrow request');
    } finally {
      setBorrowing(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-[var(--text-muted)]">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-400">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="card">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <div className="bg-[var(--bg-surface)] rounded-xl h-80 flex items-center justify-center border border-[var(--border-color)]">
              {book.cover_image_url ? (
                <img src={book.cover_image_url} alt={book.title} className="h-full object-cover rounded-xl" />
              ) : (
                <span className="text-8xl">📚</span>
              )}
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2 text-[var(--text-primary)]">{book.title}</h1>
            <p className="text-xl text-[var(--text-muted)] mb-4">by {book.author}</p>
            
            <div className="space-y-2 mb-6">
              <p className="text-[var(--text-primary)]"><span className="font-semibold">Genre:</span> {book.genre}</p>
              <p className="text-[var(--text-primary)]"><span className="font-semibold">Published:</span> {book.published_year}</p>
              <p className="text-[var(--text-primary)]"><span className="font-semibold">Available:</span>
                <span className={book.available > 0 ? 'text-green-400' : 'text-red-400'}>
                  {book.available} copies
                </span>
              </p>
            </div>

            {book.available > 0 ? (
              <button
                onClick={handleRequest}
                disabled={borrowing}
                className="btn-primary disabled:opacity-50"
              >
                {borrowing ? 'Submitting...' : 'Request to Borrow'}
              </button>
            ) : (
              <button disabled className="bg-[var(--text-muted)] text-[var(--text-primary)] px-6 py-2 rounded-lg cursor-not-allowed opacity-50">
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