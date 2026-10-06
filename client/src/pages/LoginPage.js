import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import EyeIcon from '../components/EyeIcon';

function LoginPage() {

  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Toggle between the customer and admin login form on the same page.
  // ?as=admin lets AdminRoute send someone here with the admin tab
  // already selected, but the toggle itself is visible to everyone --
  // no hidden URL needed.
  const [loginType, setLoginType] = useState(
    searchParams.get('as') === 'admin' ? 'admin' : 'customer'
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const isAdminLogin = loginType === 'admin';

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const loggedInUser = await login(email, password);

      if (isAdminLogin && !loggedInUser.isAdmin) {
        // Correct credentials, but not an admin account -- don't leave
        // them signed in on the admin tab.
        logout();
        setError('This login is for administrators only.');
        setSubmitting(false);
        return;
      }

      navigate(isAdminLogin ? '/admin' : '/shop');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      setSubmitting(false);
    }
  }

  const tabs = (
    <div className="auth-tabs" role="tablist" aria-label="Login as">
      <button
        type="button"
        role="tab"
        aria-selected={!isAdminLogin}
        className={`auth-tab ${!isAdminLogin ? 'active' : ''}`}
        onClick={() => { setLoginType('customer'); setError(null); }}
      >
        Customer
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={isAdminLogin}
        className={`auth-tab ${isAdminLogin ? 'active' : ''}`}
        onClick={() => { setLoginType('admin'); setError(null); }}
      >
        Admin
      </button>
    </div>
  );

  return (
    <AuthLayout
      tabs={tabs}
      title={isAdminLogin ? 'Admin sign in' : 'Welcome back'}
      subtitle={
        isAdminLogin
          ? 'Manage orders, products and customers.'
          : 'Sign in to pick up your cart or track a delivery.'
      }
      footer={
        !isAdminLogin && (
          <>Don't have an account? <Link to="/signup" className="auth-link">Create one</Link></>
        )
      }
    >
      <form onSubmit={handleSubmit} noValidate>

        <div className="auth-field">
          <label htmlFor="email" className="auth-label">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
            autoComplete="email"
          />
        </div>

        <div className="auth-field">
          <div className="auth-label-row">
            <label htmlFor="password" className="auth-label">Password</label>
            {!isAdminLogin && (
              <Link to="/forgot-password" className="auth-link auth-link-small">
                Forgot password?
              </Link>
            )}
          </div>
          <div className="auth-input-wrap">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="auth-eye-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
        </div>

        {error && <p className="auth-error" role="alert">{error}</p>}

        <button type="submit" className="auth-submit" disabled={submitting}>
          {submitting ? 'Signing in…' : (isAdminLogin ? 'Sign in as admin' : 'Sign in')}
        </button>

      </form>
    </AuthLayout>
  );
}

export default LoginPage;