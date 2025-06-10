import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import '../styles/LoginPage.css'; // Assuming you'll add some basic styling
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import axios from 'axios'; // Import axios

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Get login function from AuthContext
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleManualLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      login(response.data.user, response.data.token); // Use login from AuthContext
      navigate('/dashboard');
    } catch (error) {
      console.error('Manual Login Failed:', error.response?.data?.message || error.message);
      alert('Manual Login Failed: ' + (error.response?.data?.message || 'Server error'));
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log('Google Login Success:', credentialResponse);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/google', {
        id_token: credentialResponse.credential,
      });
      login(response.data.user, response.data.token); // Use login from AuthContext
      navigate('/dashboard');
    } catch (error) {
      console.error('Google Login Failed:', error.response?.data?.message || error.message);
      alert('Google Login Failed: ' + (error.response?.data?.message || 'Server error'));
    }
  };

  const handleGoogleError = () => {
    console.log('Google Login Failed');
    alert('Google Login was unsuccessful. Please try again.');
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleManualLogin} className="login-form">
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
        <button type="submit" className="manual-login-button">
          Login
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

export default LoginPage; 