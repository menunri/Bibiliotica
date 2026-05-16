import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../services/auth.service';

function Cart() {
  const [cart, setCart] = useState([]);
  const user = AuthService.getUser();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('bibliotica_cart') || '[]');
    setCart(storedCart);
  }, []);

  const removeFromCart = (bookId) => {
    const updatedCart = cart.filter(item => item.book_id !== bookId);
    setCart(updatedCart);
    localStorage.setItem('bibliotica_cart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('bibliotica_cart');
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Please login to view your cart</h2>
        <Link to="/login" className="btn-primary">Login</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <span className="text-6xl">🛒</span>
          <p className="mt-4">Your cart is empty.</p>
          <Link to="/books" className="text-indigo-600 hover:underline mt-2 inline-block">Browse Books</Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.book_id} className="card flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    {item.cover_image_url ? (
                      <img src={item.cover_image_url} alt={item.title} className="h-full object-cover rounded-lg" />
                    ) : (
                      <span>📚</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-gray-500">{item.author}</p>
                    {item.price && <p className="text-indigo-600">${item.price}</p>}
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.book_id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-between items-center">
            <button onClick={clearCart} className="text-gray-600 hover:text-gray-800">
              Clear Cart
            </button>
            <button className="btn-primary">Checkout</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;