import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../services/auth.service';
import { BookOpen, Bell, Search, Sparkles, Shield, Clock } from 'lucide-react';

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
    <div className="min-h-screen">
      {/* Hero Section - Magical Gradient */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-royal-900 via-royal-800 to-royal-700"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAzOGM3NSIgstb3BlY3NpdHk9ImF1dG9zaGFkb3ciIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 text-center">
          <div className="mb-6 inline-flex items-center px-4 py-2 rounded-full bg-gold/10 border border-gold/30">
            <Sparkles className="w-4 h-4 text-gold mr-2" />
            <span className="text-gold text-sm font-cinzel">Your Magical Library Awaits</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold font-cinzel-decorative text-gold mb-6 tracking-wide">
            Welcome to <span className="text-gold-light">Bibliotica</span>
          </h1>
          <p className="text-xl text-gold/70 mb-10 max-w-2xl mx-auto font-cinzel">
            Discover a world of knowledge within our enchanted collection
          </p>
          {user ? (
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/books"
                className="group flex items-center space-x-2 bg-gold-300 text-stone-900 px-8 py-4 rounded-lg font-cinzel font-semibold hover:bg-gold-600 transition-all duration-300 shadow-gold"
              >
                <Search className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Browse Books</span>
              </Link>
              <Link
                to="/my-borrows"
                className="group flex items-center space-x-2 bg-surface/50 border-2 border-gold/50 text-gold px-8 py-4 rounded-lg font-cinzel font-semibold hover:border-gold hover:bg-gold/10 transition-all duration-300"
              >
                <BookOpen className="w-5 h-5" />
                <span>My Library</span>
              </Link>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/signup"
                className="group flex items-center space-x-2 bg-gold-300 text-stone-900 px-8 py-4 rounded-lg font-cinzel font-semibold hover:bg-gold-600 transition-all duration-300 shadow-gold"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Begin Your Journey</span>
              </Link>
              <Link
                to="/login"
                className="group flex items-center space-x-2 bg-surface/50 border-2 border-gold/50 text-gold px-8 py-4 rounded-lg font-cinzel font-semibold hover:border-gold hover:bg-gold/10 transition-all duration-300"
              >
                <span>Enter Library</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold font-cinzel-decorative text-gold text-center mb-16">
            Library Enchantments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card group hover:border-gold/50 transition-all duration-300">
              <div className="w-16 h-16 mb-6 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                <BookOpen className="w-8 h-8 text-gold group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-cinzel font-semibold text-gold mb-3">Browse & Borrow</h3>
              <p className="text-gold/60 font-cinzel">Explore our collection and borrow books with ease</p>
            </div>
            <div className="card group hover:border-gold/50 transition-all duration-300">
              <div className="w-16 h-16 mb-6 rounded-full bg-magical-teal/10 flex items-center justify-center group-hover:bg-magical-teal/20 transition-colors">
                <Bell className="w-8 h-8 text-magical-teal group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-cinzel font-semibold text-gold mb-3">Real-time Notifications</h3>
              <p className="text-gold/60 font-cinzel">Get notified about due dates and request updates</p>
            </div>
            <div className="card group hover:border-gold/50 transition-all duration-300">
              <div className="w-16 h-16 mb-6 rounded-full bg-magical-purple/10 flex items-center justify-center group-hover:bg-magical-purple/20 transition-colors">
                <Shield className="w-8 h-8 text-magical-purple group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-cinzel font-semibold text-gold mb-3">Request Books</h3>
              <p className="text-gold/60 font-cinzel">Can't find what you're looking for? Request it!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-20 bg-gradient-to-b from-transparent to-royal-900/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center mb-12">
            <Clock className="w-6 h-6 text-gold mr-3" />
            <h2 className="text-4xl font-bold font-cinzel-decorative text-gold">Featured Books</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBooks.length > 0 ? (
              featuredBooks.map(book => (
                <Link
                  key={book.id}
                  to={`/books/${book.id}`}
                  className="card group hover:border-gold transition-all duration-300"
                >
                  <div className="h-48 bg-royal-800 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
                    {book.cover_image_url ? (
                      <img src={book.cover_image_url} alt={book.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-royal-700 to-royal-900 flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-gold/30" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-cinzel font-semibold text-lg text-gold truncate">{book.title}</h3>
                  <p className="text-gold/60 truncate font-cinzel">{book.author}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="badge">{book.genre || 'Uncategorized'}</span>
                    <span className="text-magical-teal text-sm font-cinzel">{book.available} available</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <BookOpen className="w-16 h-16 text-gold/30 mx-auto mb-4" />
                <p className="text-gold/50 font-cinzel">No featured books at the moment</p>
              </div>
            )}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/books"
              className="inline-flex items-center space-x-2 text-gold hover:text-gold-light transition-all font-cinzel group"
            >
              <span>View All Books</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-royal-900 border-t border-gold/20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BookOpen className="w-6 h-6 text-gold" />
            <span className="text-xl font-cinzel-decorative text-gold">Bibliotica</span>
          </div>
          <p className="text-gold/50 font-cinzel text-sm">© 2024 Bibliotica Library. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;