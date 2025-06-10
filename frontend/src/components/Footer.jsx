import React from 'react';

const Footer = () => {
  const styles = {
    footer: {
      backgroundColor: '#1e1e2f',
      color: '#ffffff',
      padding: '20px 30px',
      textAlign: 'center',
      borderTop: '1px solid #2e2e3e',
      fontSize: '14px',
      width: '100%',
      marginTop: 'auto',
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    nav: {
      display: 'flex',
      gap: '20px',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginTop: '10px',
    },
    link: {
      color: '#0dcaf0',
      textDecoration: 'none',
      fontWeight: '500',
      transition: 'color 0.3s ease',
    },
    linkHover: {
      color: '#ffffff',
      textDecoration: 'underline',
    }
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.content}>
        <p>&copy; {new Date().getFullYear()} TaskMoRen. All rights reserved.</p>
        <nav style={styles.nav}>
          <a
            href="/about-us"
            style={styles.link}
            onMouseOver={(e) => (e.target.style.color = styles.linkHover.color)}
            onMouseOut={(e) => (e.target.style.color = styles.link.color)}
          >
            About Us
          </a>
          <a
            href="/contact-us"
            style={styles.link}
            onMouseOver={(e) => (e.target.style.color = styles.linkHover.color)}
            onMouseOut={(e) => (e.target.style.color = styles.link.color)}
          >
            Contact Us
          </a>
          <a
            href="/privacy-policy"
            style={styles.link}
            onMouseOver={(e) => (e.target.style.color = styles.linkHover.color)}
            onMouseOut={(e) => (e.target.style.color = styles.link.color)}
          >
            Privacy Policy
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
