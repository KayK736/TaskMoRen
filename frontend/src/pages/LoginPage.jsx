import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleManualLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      login(response.data.user, response.data.token);
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
      login(response.data.user, response.data.token);
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

  const handleAdminLogin = () => {
    navigate('/admin/login');
  };

  // Inline styles
  const styles = {
    container: {
      maxWidth: '400px',
      margin: '60px auto',
      padding: '30px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      textAlign: 'center',
      backgroundColor: '#f9f9f9',
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
      borderRadius: '4px',
      border: '1px solid #ccc',
      fontSize: '14px',
    },
    button: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      cursor: 'pointer',
    },
    separator: {
      margin: '20px 0',
      fontWeight: 'bold',
      color: '#888',
    },
    adminButton: {
      marginTop: '15px',
      width: '100%',
      padding: '10px',
      backgroundColor: '#555',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '14px',
      cursor: 'pointer',
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleManualLogin} style={{ textAlign: 'left' }}>
        <div style={styles.formGroup}>
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
        <div style={styles.formGroup}>
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
        <button type="submit" style={styles.button}>Login</button>
      </form>

      <div style={styles.separator}>OR</div>

      <div style={{ marginBottom: '10px' }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
        />
      </div>

      <div className="admin-login-section">
        <button onClick={handleAdminLogin} style={styles.adminButton}>
          Admin Login
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
