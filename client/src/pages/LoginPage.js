import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {

  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await login(email, password);
      navigate('/shop');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <div style={{ padding: '40px 30px', maxWidth: '400px', margin: '0 auto' }}>

      <h1 style={{ color: '#e91e8c', textAlign: 'center' }}>Login</h1>

      <form onSubmit={handleSubmit}>

        {/* Email */}
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

        {/* Password with eye icon */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '5px'
          }}>
            <label style={{ fontWeight: 'bold' }}>Password</label>
            <Link
              to="/forgot-password"
              style={{ color: '#e91e8c', fontSize: '13px' }}
            >
              Forgot Password?
            </Link>
          </div>

          {/* Input wrapper for eye icon */}
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 40px 10px 10px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                fontSize: '14px'
              }}
            />
            {/* Eye toggle button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                color: '#999',
                padding: '0'
              }}
            >
              {showPassword ? '◉̷' : '👁️'}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p style={{ color: 'red', fontSize: '14px', marginBottom: '15px' }}>{error}</p>
        )}

        {/* Submit */}
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
        Don't have an account?{' '}
        <Link to="/signup" style={{ color: '#e91e8c' }}>Sign up</Link>
      </p>

    </div>
  );
}

export default LoginPage;