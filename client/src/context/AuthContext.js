// Import tools needed to create and share context across components
import { createContext, useContext, useState, useEffect } from 'react';

// Import our pre-configured axios instance
import api from '../api/axiosConfig';

// Create the context - shared storage for user/login info
const AuthContext = createContext();

// AuthProvider wraps our whole app so every page can access auth state
export function AuthProvider({ children }) {

  // Holds the logged-in user's info (null if not logged in)
  const [user, setUser] = useState(null);

  // Tracks whether we're still checking for a saved login on first load
  const [loading, setLoading] = useState(true);

  // On first load, check if a token + user are already saved in localStorage
  // This keeps the user logged in even after refreshing the page
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  // Function to sign up a new user
  async function signup(name, email, password) {
    const response = await api.post('/auth/signup', { name, email, password });

    // Save token and user info so they stay logged in across refreshes
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    setUser(response.data.user);
  }

  // Function to log in an existing user
  async function login(email, password) {
    const response = await api.post('/auth/login', { email, password });

    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    setUser(response.data.user);
  }

  // Function to log out - clears everything
  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook so pages can easily use auth with one line:
// const { user, login, logout } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}