import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/myFirst.css'; // Assuming you'll add some basic styling

function MyFirst() {
  const navigate = useNavigate();

 

  const handleLoginClick = () => {
    navigate('/login'); // Navigate to the login page
  };

  const handleSignUpClick = () => {
    navigate('/signup'); // Navigate to the signup page
  };

  return (
    <div className="my-first-container">
      <h1>Welcome to TaskMoRen!</h1>
      <p>Your ultimate task management solution.</p>
      
      <button onClick={handleLoginClick} className="login-button">
        Login
      </button>
      <button onClick={handleSignUpClick} className="signup-button">
        Sign Up
      </button>
    </div>
  );
}

export default MyFirst; 