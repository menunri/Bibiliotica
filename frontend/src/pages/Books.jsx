import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');

  useEffect(() => {
    fetchBooks();
  }, [search, genre]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (genre) params.append('genre', genre);
      params.append('available', '1');

      const response = await fetch(`/api/books?${params.toString()}`);
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setLoading(false);
    }
  };

  const genres = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Fantasy', 'Biography', 'Technology'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Books</h1>

      {/* Search and Filter */}
      <div className="flex flex-wrap gap-4 mb-8">
        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="">All Genres</option>
          {genres.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : books.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No books found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map(book => (
            <Link key={book.id} to={`/books/${book.id}`} className="card hover:shadow-lg transition">
              <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {book.cover_image_url ? (
                  <img src={book.cover_image_url} alt={book.title} className="h-full object-cover" />
                ) : (
                  <span className="text-5xl">📚</span>
                )}
              </div>
              <h3 className="font-semibold text-lg truncate">{book.title}</h3>
              <p className="text-gray-500 truncate">{book.author}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{book.genre}</span>
                <span className="text-sm text-green-600">{book.available} available</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Books;