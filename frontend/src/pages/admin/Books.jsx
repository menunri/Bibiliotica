import React, { useState, useEffect } from 'react';
import AuthService from '../../services/auth.service';
import { BookOpen, Plus, Edit2, Trash2, X, Upload } from 'lucide-react';

function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    published_year: '',
    genre: '',
    available: 1,
    cover_image_url: ''
  });
  const [coverFile, setCoverFile] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadCover = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append('cover', file);

    try {
      const response = await fetch('/api/upload/upload-cover', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AuthService.getToken()}`
        },
        body: formDataUpload
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Failed to upload cover:', error);
      throw error;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file type. Only jpg, png, webp, and gif are allowed.');
        e.target.value = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB.');
        e.target.value = '';
        return;
      }
      setCoverFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let coverUrl = formData.cover_image_url;

      if (coverFile) {
        setUploading(true);
        coverUrl = await uploadCover(coverFile);
        setUploading(false);
      }

      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AuthService.getToken()}`
        },
        body: JSON.stringify({ ...formData, cover_image_url: coverUrl })
      });

      if (response.ok) {
        alert('Book added successfully!');
        setFormData({ title: '', author: '', published_year: '', genre: '', available: 1, cover_image_url: '' });
        setCoverFile(null);
        setShowForm(false);
        fetchBooks();
      } else {
        alert('Failed to add book');
      }
    } catch (error) {
      alert('Failed to add book');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title || '',
      author: book.author || '',
      published_year: book.published_year || '',
      genre: book.genre || '',
      available: book.available || 1,
      cover_image_url: book.cover_image_url || ''
    });
    setCoverFile(null);
    setShowForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      let coverUrl = formData.cover_image_url;

      if (coverFile) {
        setUploading(true);
        coverUrl = await uploadCover(coverFile);
        setUploading(false);
      }

      const response = await fetch(`/api/books/${editingBook.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AuthService.getToken()}`
        },
        body: JSON.stringify({ ...formData, cover_image_url: coverUrl })
      });

      if (response.ok) {
        alert('Book updated successfully!');
        resetForm();
        fetchBooks();
      } else {
        alert('Failed to update book');
      }
    } catch (error) {
      alert('Failed to update book');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', author: '', published_year: '', genre: '', available: 1, cover_image_url: '' });
    setCoverFile(null);
    setShowForm(false);
    setEditingBook(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
      const response = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${AuthService.getToken()}` }
      });

      if (response.ok) {
        alert('Book deleted!');
        fetchBooks();
      }
    } catch (error) {
      alert('Failed to delete book');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gold-400 font-cinzel-decorative">Manage Books</h1>
        <button
          onClick={() => { if (showForm && editingBook) { resetForm(); } else { setShowForm(!showForm); } }}
          className="btn-primary flex items-center gap-2"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Cancel' : '+ Add Book'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-8 border border-gold-400/20">
          <h2 className="text-xl font-semibold mb-4 text-gold-400 font-cinzel flex items-center gap-2">
            <BookOpen size={20} />
            {editingBook ? 'Edit Book' : 'Add New Book'}
          </h2>
          <form onSubmit={editingBook ? handleUpdate : handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gold-400/80 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input"
                  placeholder="Enter book title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gold-400/80 mb-1">Author *</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="input"
                  placeholder="Enter author name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gold-400/80 mb-1">Published Year</label>
                <input
                  type="number"
                  value={formData.published_year}
                  onChange={(e) => setFormData({ ...formData, published_year: e.target.value })}
                  className="input"
                  placeholder="2024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gold-400/80 mb-1">Genre</label>
                <select
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  className="input"
                >
                  <option value="">Select Genre</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Science">Science</option>
                  <option value="History">History</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Biography">Biography</option>
                  <option value="Technology">Technology</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gold-400/80 mb-1">Available Copies</label>
                <input
                  type="number"
                  value={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: parseInt(e.target.value) })}
                  className="input"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gold-400/80 mb-1">Cover Image</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileChange}
                  className="input file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-gold-400/20 file:text-gold-400 hover:file:bg-gold-400/30 file:transition-colors"
                />
                <p className="text-xs text-gold-400/50 mt-1">JPG, PNG, WEBP, or GIF up to 5MB</p>
                {coverFile && (
                  <p className="text-sm text-emerald-400 mt-1">Selected: {coverFile.name}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="btn-primary flex items-center gap-2"
                disabled={uploading}
              >
                <Upload size={18} />
                {uploading ? 'Uploading...' : (editingBook ? 'Update Book' : 'Add Book')}
              </button>
              {editingBook && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-gold-400/60 hover:text-gold-400 transition-colors flex items-center gap-1"
                >
                  <X size={16} /> Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="card border border-gold-400/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gold-400/10">
              <tr>
                <th className="px-4 py-3 text-left text-gold-400 font-cinzel">Title</th>
                <th className="px-4 py-3 text-left text-gold-400 font-cinzel">Author</th>
                <th className="px-4 py-3 text-left text-gold-400 font-cinzel">Genre</th>
                <th className="px-4 py-3 text-left text-gold-400 font-cinzel">Year</th>
                <th className="px-4 py-3 text-left text-gold-400 font-cinzel">Available</th>
                <th className="px-4 py-3 text-left text-gold-400 font-cinzel">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.id} className="border-t border-gold-400/10 hover:bg-gold-400/5 transition-colors">
                  <td className="px-4 py-3 text-white">{book.title}</td>
                  <td className="px-4 py-3 text-gold-400/80">{book.author}</td>
                  <td className="px-4 py-3 text-gold-400/80">{book.genre}</td>
                  <td className="px-4 py-3 text-gold-400/80">{book.published_year}</td>
                  <td className="px-4 py-3">
                    <span className={book.available > 0 ? 'text-emerald-400' : 'text-red-400'}>
                      {book.available}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-3">
                    <button
                      onClick={() => handleEdit(book)}
                      className="text-magical-teal hover:text-magical-teal/80 transition-colors flex items-center gap-1"
                    >
                      <Edit2 size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="text-red-400 hover:text-red-500 transition-colors flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminBooks;