import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../services/auth.service';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = AuthService.getUser();

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` }
      });
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Please login to view your orders</h2>
        <Link to="/login" className="btn-primary">Login</Link>
      </div>
    );
  }

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <span className="text-6xl">📦</span>
          <p className="mt-4">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.order_id} className="card">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-semibold">Order #{order.order_id}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.order_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-indigo-600">${order.total_price?.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{order.name}</p>
                </div>
              </div>
              {order.order_items && order.order_items.length > 0 && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-2">Items:</p>
                  <div className="flex gap-4 flex-wrap">
                    {order.order_items.map(item => (
                      <div key={item.item_id} className="text-sm">
                        {item.books?.title || 'Unknown'} x {item.quantity}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;