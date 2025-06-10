import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import '../styles/SignUpPage.css'; // Assuming you'll add some basic styling

function SignUpPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleManualSignUp = (e) => {
    e.preventDefault();
    // Handle manual signup logic here (e.g., send to backend API)
    console.log('Manual Sign Up Attempt:', { email, password, confirmPassword });
    // On successful signup, navigate to dashboard or login page
    navigate('/dashboard');
  };

  const handleGoogleSuccess = (credentialResponse) => {
    console.log('Google Sign Up Success:', credentialResponse);
    // Send credentialResponse.credential (ID token) to your backend for verification
    // On successful verification and signup, navigate to dashboard
    navigate('/dashboard');
  };

  const handleGoogleError = () => {
    console.log('Google Sign Up Failed');
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleManualSignUp} className="signup-form">
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
        <button type="submit" className="manual-signup-button">
          Sign Up
        </button>
      </form>
      <div className="separator">OR</div>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
      />
    </div>
  );
}

export default SignUpPage; 