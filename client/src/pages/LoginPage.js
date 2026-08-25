// useState for form fields, useNavigate to redirect after login
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Import our auth context
import { useAuth } from '../context/AuthContext';

function LoginPage() {

  // Get the login function from auth context
  const { login } = useAuth();

  // Lets us redirect after successful login
  const navigate = useNavigate();

  // Form field values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Tracks loading and error states
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await login(email, password);
      // After successful login, send them to the shop page
      navigate('/shop');
    } catch (err) {
      // Show the error message sent back from our backend
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <div style={{ padding: '40px 30px', maxWidth: '400px', margin: '0 auto' }}>

      <h1 style={{ color: '#e91e8c', textAlign: 'center' }}>Login</h1>

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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
            <label style={{ fontWeight: 'bold' }}>Password</label>
            <Link to="/forgot-password" style={{ color: '#e91e8c', fontSize: '13px' }}>
              Forgot Password?
            </Link>
          </div>
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
            backgroundColor: submitting ? '#ccc' : '#e91e8c',
            color: 'white',
            border: 'none',
            padding: '12px',
            borderRadius: '8px',
            cursor: submitting ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {submitting ? 'Logging in...' : 'Login'}
        </button>

      </form>

      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
        Don't have an account? <Link to="/signup" style={{ color: '#e91e8c' }}>Sign up</Link>
      </p>

    </div>
  );
}

export default LoginPage;