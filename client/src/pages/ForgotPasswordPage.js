// useState for managing the multi-step forgot password flow
import { useState } from 'react';

// Link to go back to login
import { Link, useNavigate } from 'react-router-dom';

// EmailJS to send the reset code email
import emailjs from '@emailjs/browser';

// Our axios instance to call the backend
import api from '../api/axiosConfig';

//  Replace these with your actual EmailJS credentials
const EMAILJS_SERVICE_ID = 'your_service_id';
const EMAILJS_TEMPLATE_ID = 'your_template_id';
const EMAILJS_PUBLIC_KEY = 'your_public_key';

function ForgotPasswordPage() {

  const navigate = useNavigate();

  // Step 1: enter email
  // Step 2: enter reset code + new password
  const [step, setStep] = useState(1);

  // Form values
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handles Step 1 - verify email exists and send reset code
  async function handleSendCode(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Ask backend to verify email exists and generate a reset code
      const response = await api.post('/auth/verify-email', { email });

      const { resetCode: generatedCode, userName } = response.data;

      // Send the code to the user's email via EmailJS
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: email,
          to_name: userName,
          reset_code: generatedCode,
        },
        EMAILJS_PUBLIC_KEY
      );

      // Move to step 2
      setStep(2);
      setSuccess('A 6-digit reset code has been sent to your email.');
      setLoading(false);

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  // Handles Step 2 - verify code and reset password
  async function handleResetPassword(e) {
    e.preventDefault();
    setError(null);

    // Check passwords match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Check password length
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/reset-password', {
        email,
        code: resetCode,
        newPassword,
      });

      setSuccess('Password reset successfully!');
      setLoading(false);

      // Redirect to login after 2 seconds
      setTimeout(() => navigate('/login'), 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '40px 30px', maxWidth: '420px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔐</div>
        <h1 style={{ color: '#e91e8c', margin: '0 0 8px 0' }}>
          {step === 1 ? 'Forgot Password?' : 'Reset Password'}
        </h1>
        <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
          {step === 1
            ? 'Enter your email and we\'ll send you a reset code'
            : `Enter the 6-digit code sent to ${email}`}
        </p>
      </div>

      {/* Step indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '25px',
        gap: '8px'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: '#e91e8c',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>1</div>
        <div style={{
          width: '60px',
          height: '2px',
          backgroundColor: step === 2 ? '#e91e8c' : '#ddd'
        }} />
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: step === 2 ? '#e91e8c' : '#ddd',
          color: step === 2 ? 'white' : '#999',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>2</div>
      </div>

      {/* Success message */}
      {success && (
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '12px 15px',
          borderRadius: '8px',
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          ✅ {success}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '12px 15px',
          borderRadius: '8px',
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          ❌ {error}
        </div>
      )}

      {/* ── STEP 1: Enter Email ── */}
      {step === 1 && (
        <form onSubmit={handleSendCode}>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your registered email"
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                fontSize: '14px'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: loading ? '#ccc' : '#e91e8c',
              color: 'white',
              border: 'none',
              padding: '13px',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '15px',
              fontWeight: 'bold',
              marginBottom: '15px'
            }}
          >
            {loading ? 'Sending code...' : 'Send Reset Code'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
            Remember your password?{' '}
            <Link to="/login" style={{ color: '#e91e8c' }}>Login</Link>
          </p>

        </form>
      )}

      {/* ── STEP 2: Enter Code + New Password ── */}
      {step === 2 && (
        <form onSubmit={handleResetPassword}>

          {/* Reset code */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              6-Digit Reset Code
            </label>
            <input
              type="text"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              required
              maxLength={6}
              placeholder="Enter the code from your email"
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                fontSize: '18px',
                textAlign: 'center',
                letterSpacing: '8px'
              }}
            />
          </div>

          {/* New password */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              placeholder="At least 6 characters"
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Confirm password */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Re-enter your new password"
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                fontSize: '14px'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: loading ? '#ccc' : '#e91e8c',
              color: 'white',
              border: 'none',
              padding: '13px',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '15px',
              fontWeight: 'bold',
              marginBottom: '15px'
            }}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>

          {/* Resend code option */}
          <p style={{ textAlign: 'center', fontSize: '13px', color: '#666' }}>
            Didn't receive the code?{' '}
            <span
              onClick={() => { setStep(1); setError(null); setSuccess(null); }}
              style={{ color: '#e91e8c', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Try again
            </span>
          </p>

        </form>
      )}

    </div>
  );
}

export default ForgotPasswordPage;