const API_URL = "https://bibiliotica-production.up.railway.app";

export const API_ENDPOINTS = {
  // Auth
  REGISTER: `${API_URL}/api/auth/register`,
  LOGIN: `${API_URL}/api/auth/login`,
  ADMIN_LOGIN: `${API_URL}/api/auth/admin/login`,
  VERIFY: `${API_URL}/api/auth/verify`,

  // Users
  USER_PROFILE: `${API_URL}/api/users/me`,
  USER_STATS: `${API_URL}/api/users/stats`,

  // Books
  BOOKS: `${API_URL}/api/books`,
  BOOKS_GENRE: (genre) => `${API_URL}/api/books/genre/${genre}`,

  // Borrow
  BORROW_BOOK: `${API_URL}/api/borrow/borrow`,
  MY_BORROWS: `${API_URL}/api/borrow/my-borrows`,
  RETURN_BOOK: `${API_URL}/api/borrow/return`,
  ALL_BORROWS: `${API_URL}/api/borrow/all`,

  // Requests
  BOOK_REQUESTS: `${API_URL}/api/requests`,
  MY_REQUESTS: `${API_URL}/api/requests/my-requests`,
  ALL_REQUESTS: `${API_URL}/api/requests/all`,

  // Notifications
  NOTIFICATIONS: `${API_URL}/api/notifications`,
  UNREAD_COUNT: `${API_URL}/api/notifications/unread-count`,
  READ_ALL: `${API_URL}/api/notifications/read-all`,

  // Orders
  ORDERS: `${API_URL}/api/orders`,
  MY_ORDERS: `${API_URL}/api/orders/my-orders`,
  ALL_ORDERS: `${API_URL}/api/orders/all`,

  // Admin
  ADMIN_DASHBOARD: `${API_URL}/api/admin/dashboard`,
  ADMIN_USERS: `${API_URL}/api/admin/users`,
  ADMIN_RETURNED: `${API_URL}/api/admin/returned`,
  ADMIN_STATS: `${API_URL}/api/admin/stats`
};

export default API_ENDPOINTS;