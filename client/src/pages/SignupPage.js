// useState for form fields, useNavigate to redirect after signup
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Import our auth context
import { useAuth } from '../context/AuthContext';

function SignupPage() {

  // Get the signup function from auth context
  const { signup } = useAuth();

  // Lets us redirect after successful signup
  const navigate = useNavigate();

  // Form field values
  const [name, setName] = useState('');
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
      await signup(name, email, password);
      // After successful signup, send them to the shop page (already logged in)
      navigate('/shop');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <div style={{ padding: '40px 30px', maxWidth: '400px', margin: '0 auto' }}>

      <h1 style={{ color: '#e91e8c', textAlign: 'center' }}>Sign Up</h1>

      <form onSubmit={handleSubmit}>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            minLength={6}
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
          {submitting ? 'Creating account...' : 'Sign Up'}
        </button>

      </form>

      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
        Already have an account? <Link to="/login" style={{ color: '#e91e8c' }}>Login</Link>
      </p>

    </div>
  );
}

export default SignupPage;