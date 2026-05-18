import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Filter, X } from 'lucide-react';

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
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-cinzel-decorative text-gold mb-4">Browse Collection</h1>
          <p className="text-gold/60 font-cinzel">Discover your next magical read</p>
        </div>

        {/* Search and Filter */}
        <div className="card mb-10">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/50" />
              <input
                type="text"
                placeholder="Search by title or author..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-royal-800/50 border border-gold/30 rounded-lg focus:border-gold focus:ring-gold/20 focus:outline-none font-cinzel text-gold placeholder:text-gold/40"
              />
            </div>
            <div className="relative min-w-[180px]">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/50" />
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full pl-10 pr-8 py-3 bg-royal-800/50 border border-gold/30 rounded-lg focus:border-gold focus:ring-gold/20 focus:outline-none font-cinzel text-gold appearance-none cursor-pointer"
              >
                <option value="" className="bg-royal-800">All Genres</option>
                {genres.map(g => (
                  <option key={g} value={g} className="bg-royal-800">{g}</option>
                ))}
              </select>
            </div>
            {(search || genre) && (
              <button
                onClick={() => { setSearch(''); setGenre(''); }}
                className="flex items-center space-x-2 px-4 py-3 text-gold/60 hover:text-gold transition-colors"
              >
                <X className="w-4 h-4" />
                <span className="font-cinzel">Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-20">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gold/60 font-cinzel">Searching the archives...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20 card">
            <BookOpen className="w-16 h-16 text-gold/30 mx-auto mb-4" />
            <p className="text-gold/60 font-cinzel text-lg">No books found in our collection</p>
            <p className="text-gold/40 font-cinzel text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <p className="text-gold/60 font-cinzel mb-6">{books.length} {books.length === 1 ? 'book' : 'books'} found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map(book => (
                <Link 
                  key={book.id} 
                  to={`/books/${book.id}`} 
                  className="card group hover:border-gold transition-all duration-300"
                >
                  <div className="h-56 bg-royal-800 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
                    {book.cover_image_url ? (
                      <img 
                        src={book.cover_image_url} 
                        alt={book.title} 
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-royal-700 to-royal-900 flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-gold/30 group-hover:scale-110 transition-transform" />
                      </div>
                    )}
                    {book.available <= 3 && book.available > 0 && (
                      <span className="absolute top-2 right-2 bg-magical-teal/90 text-royal-900 text-xs font-cinzel font-bold px-2 py-1 rounded">
                        Last few!
                      </span>
                    )}
                  </div>
                  <h3 className="font-cinzel font-semibold text-lg text-gold truncate mb-1">{book.title}</h3>
                  <p className="text-gold/60 truncate font-cinzel mb-4">{book.author}</p>
                  <div className="flex justify-between items-center">
                    <span className="badge">{book.genre || 'Uncategorized'}</span>
                    <span className={`text-sm font-cinzel ${book.available > 0 ? 'text-magical-teal' : 'text-red-400'}`}>
                      {book.available > 0 ? `${book.available} available` : 'Unavailable'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Books;