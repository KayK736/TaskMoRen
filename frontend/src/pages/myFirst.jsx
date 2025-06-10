import React from 'react';
import { useNavigate } from 'react-router-dom';

function MyFirst() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <div style={styles.welcomePageContainer}>
      <header style={styles.welcomePageHeader}>
        <h1 style={styles.welcomePageTitle}>TaskMoRen</h1>
        <nav style={styles.welcomePageNav}>
          <button onClick={handleLoginClick} style={styles.welcomeLoginButton}>
            Login
          </button>
          <button onClick={handleSignUpClick} style={styles.welcomeSignupButton}>
            Sign Up
          </button>
        </nav>
      </header>
      <main style={styles.welcomePageMain}>
        <section style={styles.heroSection}>
          <div style={styles.heroContent}>
            <h2 style={styles.heroTitle}>Streamline Your Tasks, Master Your Time.</h2>
            <p style={styles.heroSubtitle}>Your ultimate solution for effortless task management and productivity.</p>
            <div style={styles.heroButtons}>
              <button onClick={handleSignUpClick} style={styles.heroSignupButton}>
                Get Started Now
              </button>
              <button onClick={handleLoginClick} style={styles.heroLoginButton}>
                Already a member? Log In
              </button>
            </div>
          </div>
          <div style={styles.heroImageContainer}>
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
              alt="Productivity Dashboard" 
              style={styles.heroImage} 
            />
          </div>
        </section>
      </main>
      <footer style={styles.welcomePageFooter}>
        <p>&copy; {new Date().getFullYear()} TaskMoRen. All rights reserved.</p>
      </footer>
    </div>
  );
}

const styles = {
  welcomePageContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#2d3748',
    overflowX: 'hidden',
  },
  welcomePageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 5%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  welcomePageTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0,
  },
  welcomePageNav: {
    display: 'flex',
    gap: '1rem',
  },
  welcomeLoginButton: {
    padding: '0.6rem 1.5rem',
    borderRadius: '25px',
    border: '2px solid #667eea',
    backgroundColor: 'transparent',
    color: '#667eea',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '0.9rem',
    outline: 'none',
    ':hover': {
      backgroundColor: '#667eea',
      color: 'white',
      transform: 'translateY(-2px)',
    },
  },
  welcomeSignupButton: {
    padding: '0.6rem 1.5rem',
    borderRadius: '25px',
    border: 'none',
    backgroundColor: '#667eea',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '0.9rem',
    outline: 'none',
    ':hover': {
      backgroundColor: '#5a67d8',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(102, 126, 234, 0.4)',
    },
  },
  welcomePageMain: {
    flex: 1,
    padding: '2rem 5%',
    display: 'flex',
    alignItems: 'center',
  },
  heroSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: '3rem',
  },
  heroContent: {
    flex: 1,
    maxWidth: '600px',
    animation: 'fadeIn 1s ease-out',
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: '800',
    lineHeight: '1.2',
    marginBottom: '1.5rem',
    background: 'linear-gradient(90deg, #2d3748 0%, #4a5568 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: '1.2rem',
    color: '#4a5568',
    marginBottom: '2rem',
    lineHeight: '1.6',
  },
  heroButtons: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem',
  },
  heroSignupButton: {
    padding: '0.8rem 2rem',
    borderRadius: '30px',
    border: 'none',
    backgroundColor: '#667eea',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '1rem',
    outline: 'none',
    boxShadow: '0 4px 6px rgba(102, 126, 234, 0.3)',
    ':hover': {
      backgroundColor: '#5a67d8',
      transform: 'translateY(-3px)',
      boxShadow: '0 6px 12px rgba(102, 126, 234, 0.4)',
    },
  },
  heroLoginButton: {
    padding: '0.8rem 2rem',
    borderRadius: '30px',
    border: '2px solid #667eea',
    backgroundColor: 'transparent',
    color: '#667eea',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '1rem',
    outline: 'none',
    ':hover': {
      backgroundColor: '#667eea',
      color: 'white',
      transform: 'translateY(-3px)',
      boxShadow: '0 6px 12px rgba(102, 126, 234, 0.2)',
    },
  },
  heroImageContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    animation: 'float 6s ease-in-out infinite',
  },
  heroImage: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '15px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    transition: 'transform 0.5s ease',
    ':hover': {
      transform: 'scale(1.02)',
    },
  },
  welcomePageFooter: {
    textAlign: 'center',
    padding: '1.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    color: '#4a5568',
    fontSize: '0.9rem',
  },
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  '@keyframes float': {
    '0%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-20px)' },
    '100%': { transform: 'translateY(0px)' },
  },
};

export default MyFirst;