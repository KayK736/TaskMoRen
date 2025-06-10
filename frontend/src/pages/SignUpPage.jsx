import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

function SignUpPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('signup');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleManualSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
      });
      setMessage(response.data.message);
      setStep('verify_otp');
      setLoading(false);
    } catch (err) {
      console.error('Manual Sign Up Failed:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Server error');
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-otp', {
        email,
        otp,
      });
      login(response.data.user, response.data.token);
      setMessage('Registration complete! Redirecting to dashboard...');
      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      console.error('OTP Verification Failed:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Invalid or expired OTP.');
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log('Google Sign Up Success:', credentialResponse);
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/google', {
        id_token: credentialResponse.credential,
      });
      login(response.data.user, response.data.token);
      setMessage('Google Sign Up successful! Redirecting to dashboard...');
      setLoading(false);
      navigate('/dashboard');
    } catch (error) {
      console.error('Google Sign Up Failed:', error.response?.data?.message || error.message);
      setError(error.response?.data?.message || 'Server error');
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.log('Google Sign Up Failed');
    setError('Google Sign Up was unsuccessful. Please try again.');
  };

  const handleAdminLogin = () => {
    navigate('/admin/login');
  };

  const styles = {
    container: {
      maxWidth: '450px',
      margin: '60px auto',
      padding: '30px',
      border: '1px solid #ddd',
      borderRadius: '10px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      backgroundColor: '#fefefe',
      textAlign: 'center',
    },
    formGroup: {
      marginBottom: '15px',
      textAlign: 'left',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
    },
    input: {
      width: '100%',
      padding: '8px',
      fontSize: '14px',
      border: '1px solid #ccc',
      borderRadius: '4px',
    },
    button: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#007BFF',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      cursor: 'pointer',
    },
    otpButton: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      cursor: 'pointer',
    },
    adminButton: {
      width: '100%',
      marginTop: '10px',
      padding: '10px',
      backgroundColor: '#343a40',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '14px',
      cursor: 'pointer',
    },
    separator: {
      margin: '20px 0',
      fontWeight: 'bold',
      color: '#888',
    },
    alertSuccess: {
      backgroundColor: '#d4edda',
      padding: '10px',
      borderRadius: '4px',
      color: '#155724',
      marginBottom: '10px',
    },
    alertError: {
      backgroundColor: '#f8d7da',
      padding: '10px',
      borderRadius: '4px',
      color: '#721c24',
      marginBottom: '10px',
    }
  };

  return (
    <div className="signup-container" style={styles.container}>
      <h2>Sign Up</h2>

      {message && <div className="alert alert-success" style={styles.alertSuccess}>{message}</div>}
      {error && <div className="alert alert-danger" style={styles.alertError}>{error}</div>}

      {step === 'signup' && (
        <form onSubmit={handleManualSignUp} className="signup-form">
          <div className="form-group" style={styles.formGroup}>
            <label htmlFor="name" style={styles.label}>Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div className="form-group" style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div className="form-group" style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div className="form-group" style={styles.formGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" className="manual-signup-button" disabled={loading} style={styles.button}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>

          <div className="separator" style={styles.separator}>OR</div>

          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />

          <div className="admin-login-section">
            <button onClick={handleAdminLogin} className="admin-login-button" style={styles.adminButton}>
              Admin Login
            </button>
          </div>
        </form>
      )}

      {step === 'verify_otp' && (
        <form onSubmit={handleVerifyOtp} className="otp-form">
          <p>An OTP has been sent to your email ({email}). Please enter it below to verify your account.</p>
          <div className="form-group" style={styles.formGroup}>
            <label htmlFor="otp" style={styles.label}>Enter OTP:</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength="6"
              style={styles.input}
            />
          </div>
          <button type="submit" className="verify-otp-button" disabled={loading} style={styles.otpButton}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      )}
    </div>
  );
}

export default SignUpPage;
