import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/api.service';
import { Bell, CheckCircle, Trash2, Clock, AlertCircle } from 'lucide-react';

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="spinner mx-auto mb-4"></div>
        <p className="text-gold/60 font-cinzel">Loading notifications...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 border-2 border-gold/30 mb-4">
            <Bell className="w-8 h-8 text-gold" />
          </div>
          <h1 className="text-4xl font-bold font-cinzel-decorative text-gold mb-3">Notifications</h1>
          <p className="text-gold/60 font-cinzel">Stay updated with your library activity</p>
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="text-center py-20 card max-w-md mx-auto">
            <Bell className="w-20 h-20 text-gold/30 mx-auto mb-4" />
            <p className="text-gold/60 font-cinzel text-lg mb-2">No notifications</p>
            <p className="text-gold/40 font-cinzel text-sm">You'll be notified about your borrow requests and due dates</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(notification => (
              <div
                key={notification.notification_id}
                className={`card flex justify-between items-start transition-all ${
                  !notification.is_read 
                    ? 'border-l-4 border-magical-teal bg-magical-teal/5' 
                    : 'border-gold/20'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    {!notification.is_read && (
                      <div className="w-2 h-2 rounded-full bg-magical-teal mt-2 flex-shrink-0"></div>
                    )}
                    <p className={`font-cinzel ${!notification.is_read ? 'text-gold' : 'text-gold/70'}`}>
                      {notification.message}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-gold/40 font-cinzel text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(notification.created_at).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {!notification.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.notification_id)}
                      className="flex items-center space-x-1 px-3 py-2 text-magical-teal hover:bg-magical-teal/10 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-cinzel hidden sm:inline">Read</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification.notification_id)}
                    className="flex items-center space-x-1 px-3 py-2 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm font-cinzel hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;