const getAuthHeaders = () => {
  const token = localStorage.getItem('bibliotica_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const apiRequest = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: { ...getAuthHeaders(), ...options.headers }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

export const bookService = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/api/books${query ? `?${query}` : ''}`);
  },
  getById: async (id) => apiRequest(`/api/books/${id}`),
  getByGenre: async (genre) => apiRequest(`/api/books/genre/${genre}`)
};

export const borrowService = {
  borrow: async (book_id) => apiRequest('/api/borrow/borrow', { method: 'POST', body: JSON.stringify({ book_id }) }),
  getMyBorrows: async () => apiRequest('/api/borrow/my-borrows'),
  return: async (borrow_id) => apiRequest('/api/borrow/return', { method: 'POST', body: JSON.stringify({ borrow_id }) })
};

export const requestService = {
  create: async (data) => apiRequest('/api/requests', { method: 'POST', body: JSON.stringify(data) }),
  getMyRequests: async () => apiRequest('/api/requests/my-requests')
};

export const notificationService = {
  getAll: async () => apiRequest('/api/notifications'),
  getUnreadCount: async () => apiRequest('/api/notifications/unread-count'),
  markAsRead: async (id) => apiRequest(`/api/notifications/${id}/read`, { method: 'PUT' }),
  delete: async (id) => apiRequest(`/api/notifications/${id}`, { method: 'DELETE' })
};

export const userService = {
  getProfile: async () => apiRequest('/api/users/me'),
  updateProfile: async (data) => apiRequest('/api/users/me', { method: 'PUT', body: JSON.stringify(data) }),
  getStats: async () => apiRequest('/api/users/stats')
};

export const borrowRequestService = {
  create: async (book_id) => apiRequest('/api/borrow-requests', { method: 'POST', body: JSON.stringify({ book_id }) }),
  getMyRequests: async () => apiRequest('/api/borrow-requests/my-requests'),
  getMyLimits: async () => apiRequest('/api/borrow-requests/my-limits'),
  getAllRequests: async () => apiRequest('/api/borrow-requests/all'),
  getPendingCount: async () => apiRequest('/api/borrow-requests/pending-count'),
  approve: async (id) => apiRequest(`/api/borrow-requests/${id}/approve`, { method: 'POST' }),
  reject: async (id, notes) => apiRequest(`/api/borrow-requests/${id}/reject`, { method: 'POST', body: JSON.stringify({ notes }) })
};

export default { bookService, borrowService, requestService, notificationService, userService, borrowRequestService };