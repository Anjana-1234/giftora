import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

function AdminLoginPage() {

  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Use the same login function but check isAdmin after
      await login(email, password);

      // Get the user from localStorage to check isAdmin
      const savedUser = JSON.parse(localStorage.getItem('user'));

      if (!savedUser || !savedUser.isAdmin) {
        // Not an admin — clear auth and show error
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setError('Access denied. This login is for administrators only.');
        setSubmitting(false);
        return;
      }

      // Is admin — go to dashboard
      navigate('/admin');

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      setSubmitting(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a0a0f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '40px',
        maxWidth: '420px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
      }}>

        {/* Logo and title */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img
            src={logo}
            alt="Giftora"
            style={{
              width: '70px',
              height: '70px',
              objectFit: 'contain',
              borderRadius: '50%',
              marginBottom: '15px'
            }}
          />
          <h1 style={{ color: '#e91e8c', margin: '0 0 5px 0', fontSize: '24px' }}>
            Admin Portal
          </h1>
          <p style={{ color: '#999', fontSize: '13px', margin: 0 }}>
            Giftora Administration Access
          </p>
        </div>

        {/* Warning banner */}
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '8px',
          padding: '10px 14px',
          marginBottom: '25px',
          fontSize: '13px',
          color: '#856404',
          textAlign: 'center'
        }}>
          🔒 Restricted area — authorised personnel only
        </div>

        <form onSubmit={handleSubmit}>

          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontWeight: 'bold',
              fontSize: '14px',
              color: '#333'
            }}>
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter admin email"
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontWeight: 'bold',
              fontSize: '14px',
              color: '#333'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter admin password"
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Error message */}
          {error && (
            <div style={{
              backgroundColor: '#f8d7da',
              color: '#721c24',
              padding: '10px 14px',
              borderRadius: '8px',
              marginBottom: '15px',
              fontSize: '13px'
            }}>
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              backgroundColor: submitting ? '#ccc' : '#1a0a0f',
              color: 'white',
              border: 'none',
              padding: '13px',
              borderRadius: '8px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontSize: '15px',
              fontWeight: 'bold',
              marginBottom: '15px'
            }}
          >
            {submitting ? 'Verifying...' : '🔐 Login to Admin Portal'}
          </button>

        </form>

        {/* Back to main site */}
        <p style={{ textAlign: 'center', fontSize: '13px', color: '#999', margin: 0 }}>
          Not an admin?{' '}
          <a href="/" style={{ color: '#e91e8c', textDecoration: 'none' }}>
            Go to Giftora
          </a>
        </p>

      </div>
    </div>
  );
}

export default AdminLoginPage;