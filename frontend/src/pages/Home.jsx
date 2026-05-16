import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../services/auth.service';

function Home() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const user = AuthService.getUser();

  useEffect(() => {
    fetch('/api/books?available=1')
      .then(res => res.json())
      .then(data => setFeaturedBooks(data.slice(0, 6)))
      .catch(console.error);
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Bibliotica</h1>
          <p className="text-xl mb-8">Your digital library management system</p>
          {user ? (
            <div className="space-x-4">
              <Link to="/books" className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
                Browse Books
              </Link>
              <Link to="/my-borrows" className="bg-indigo-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-900">
                My Library
              </Link>
            </div>
          ) : (
            <div className="space-x-4">
              <Link to="/signup" className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
                Get Started
              </Link>
              <Link to="/login" className="bg-indigo-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-900">
                Login
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">📖</div>
              <h3 className="text-xl font-semibold mb-2">Browse & Borrow</h3>
              <p className="text-gray-600">Explore our collection and borrow books with ease</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🔔</div>
              <h3 className="text-xl font-semibold mb-2">Real-time Notifications</h3>
              <p className="text-gray-600">Get notified about due dates and request updates</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">Request Books</h3>
              <p className="text-gray-600">Can't find what you're looking for? Request it!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Books</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {featuredBooks.map(book => (
              <Link key={book.id} to={`/books/${book.id}`} className="card hover:shadow-lg transition">
                <div className="h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  {book.cover_image_url ? (
                    <img src={book.cover_image_url} alt={book.title} className="h-full object-cover rounded-lg" />
                  ) : (
                    <span className="text-4xl">📚</span>
                  )}
                </div>
                <h3 className="font-semibold truncate">{book.title}</h3>
                <p className="text-sm text-gray-500 truncate">{book.author}</p>
                <p className="text-xs text-green-600 mt-2">{book.available} available</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/books" className="text-indigo-600 hover:text-indigo-800 font-semibold">
              View All Books →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;