import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import '../styles/SignUpPage.css'; // Assuming you'll add some basic styling
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

function SignUpPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [name, setName] = useState(''); // Added name state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState(''); // Added OTP state
  const [step, setStep] = useState('signup'); // 'signup' or 'verify_otp'
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
        name, // Include name in the registration data
        email,
        password,
      });
      setMessage(response.data.message);
      setStep('verify_otp'); // Move to OTP verification step
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

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {step === 'signup' && (
        <form onSubmit={handleManualSignUp} className="signup-form">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="manual-signup-button" disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
          <div className="separator">OR</div>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </form>
      )}

      {step === 'verify_otp' && ( 
        <form onSubmit={handleVerifyOtp} className="otp-form">
          <p>An OTP has been sent to your email ({email}). Please enter it below to verify your account.</p>
          <div className="form-group">
            <label htmlFor="otp">Enter OTP:</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength="6"
            />
          </div>
          <button type="submit" className="verify-otp-button" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      )}
    </div>
  );
}

export default SignUpPage; 