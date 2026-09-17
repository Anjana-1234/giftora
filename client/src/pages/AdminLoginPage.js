import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminLoginPage() {

  const { login, logout } = useAuth();
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
      // Same backend endpoint as the customer login — there's only one
      // User model. The admin-only gate happens here on the frontend.
      const loggedInUser = await login(email, password);

      if (!loggedInUser.isAdmin) {
        // Correct credentials, but not an admin account — don't leave
        // them signed in on the admin login screen.
        logout();
        setError('This login is for administrators only.');
        setSubmitting(false);
        return;
      }

      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#2b1320'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '380px',
        margin: '0 20px',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '40px 30px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
      }}>

        <h1 style={{ color: '#7a3159', textAlign: 'center', marginBottom: '5px' }}>
          🌸 GiftOra Admin
        </h1>
        <p style={{ color: '#888', textAlign: 'center', marginBottom: '25px', fontSize: '14px' }}>
          Administrator sign in
        </p>

        <form onSubmit={handleSubmit}>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                fontSize: '14px'
              }}
            />
          </div>

          {error && (
            <p style={{ color: 'red', fontSize: '14px', marginBottom: '15px' }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              backgroundColor: submitting ? '#ccc' : '#7a3159',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

      </div>
    </div>
  );
}

export default AdminLoginPage;