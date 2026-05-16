import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/api.service';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getAll();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.delete(id);
      fetchNotifications();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Notifications</h1>

      {notifications.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <span className="text-6xl">🔔</span>
          <p className="mt-4">No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(notification => (
            <div
              key={notification.notification_id}
              className={`card flex justify-between items-start ${!notification.is_read ? 'border-l-4 border-indigo-500 bg-indigo-50' : ''}`}
            >
              <div className="flex-1">
                <p className="font-medium">{notification.message}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                {!notification.is_read && (
                  <button
                    onClick={() => handleMarkAsRead(notification.notification_id)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm"
                  >
                    Mark Read
                  </button>
                )}
                <button
                  onClick={() => handleDelete(notification.notification_id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;