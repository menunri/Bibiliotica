import React, { useState, useEffect } from 'react';
import AuthService from '../services/auth.service';

function AdminBorrows() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Borrowed Books Records</h1>

      {borrowedBooks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <span className="text-6xl">📖</span>
          <p className="mt-4">No borrowed books records.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Book</th>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Borrow Date</th>
                <th className="px-4 py-3 text-left">Due Date</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {borrowedBooks.map(item => (
                <tr key={item.borrow_id} className="border-t">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{item.books?.title || 'Unknown'}</p>
                      <p className="text-sm text-gray-500">{item.books?.author}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{item.users?.username}</p>
                      <p className="text-sm text-gray-500">{item.users?.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">{new Date(item.borrow_date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{new Date(item.return_due_date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={item.is_borrowed ? 'text-yellow-600 font-medium' : 'text-green-600'}>
                      {item.is_borrowed ? 'Borrowed' : 'Returned'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminBorrows;