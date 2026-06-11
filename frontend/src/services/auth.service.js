class AuthService {
  static TOKEN_KEY = 'bibliotica_token';
  static USER_KEY = 'bibliotica_user';

  static setToken(token) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setUser(user) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static getUser() {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  static logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  static isAuthenticated() {
    return !!this.getToken();
  }

  static async register(data) {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (response.ok) {
      this.setToken(result.token);
      this.setUser(result.user);
    }
    return result;
  }

  static async login(username, password) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const result = await response.json();
    if (response.ok) {
      this.setToken(result.token);
      this.setUser(result.user);
    }
    return result;
  }

  static async adminLogin(username, password) {
    const response = await fetch('/api/auth/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const result = await response.json();
    if (response.ok) {
      this.setToken(result.token);
      this.setUser(result.admin);
    }
    return result;
  }
}

export default AuthService;
