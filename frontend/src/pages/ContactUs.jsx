import React, { useState } from 'react';
import axios from 'axios';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'info', message: 'Sending message...' });

    try {
      const response = await axios.post('http://localhost:5000/api/contact', formData);
      
      setStatus({
        type: 'success',
        message: response.data.message || 'Thank you for your message! We will get back to you soon.'
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending contact message:', error);
      setStatus({
        type: 'danger',
        message: error.response?.data?.message || 'Sorry, there was an error sending your message. Please try again.'
      });
    }
  };

  // CSS Styles
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    header: {
      color: '#2d3748',
      marginBottom: '2rem',
      fontWeight: '600',
      fontSize: '2rem',
      textAlign: 'center'
    },
    card: {
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      border: 'none',
      overflow: 'hidden',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      height: '100%',
      ':hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)'
      }
    },
    cardBody: {
      padding: '2rem'
    },
    sectionTitle: {
      color: '#2d3748',
      marginBottom: '1.5rem',
      fontWeight: '600',
      fontSize: '1.25rem'
    },
    contactInfo: {
      marginBottom: '2rem',
      lineHeight: '1.8'
    },
    icon: {
      color: '#667eea',
      marginRight: '0.5rem'
    },
    formLabel: {
      fontWeight: '500',
      color: '#4a5568',
      marginBottom: '0.5rem',
      display: 'block'
    },
    formControl: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '1rem',
      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
      ':focus': {
        outline: 'none',
        borderColor: '#667eea',
        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.2)'
      }
    },
    textArea: {
      minHeight: '150px',
      resize: 'vertical'
    },
    submitButton: {
      backgroundColor: '#667eea',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      ':hover': {
        backgroundColor: '#5a67d8',
        transform: 'translateY(-2px)'
      }
    },
    alert: {
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1.5rem',
      border: '1px solid transparent'
    },
    alertSuccess: {
      backgroundColor: '#f0fff4',
      color: '#2f855a',
      borderColor: '#c6f6d5'
    },
    alertDanger: {
      backgroundColor: '#fff5f5',
      color: '#c53030',
      borderColor: '#fed7d7'
    },
    alertInfo: {
      backgroundColor: '#ebf8ff',
      color: '#2b6cb0',
      borderColor: '#bee3f8'
    },
    businessHours: {
      lineHeight: '1.8'
    }
  };

  // Dynamic alert style
  const getAlertStyle = () => {
    switch(status.type) {
      case 'success': return { ...styles.alert, ...styles.alertSuccess };
      case 'danger': return { ...styles.alert, ...styles.alertDanger };
      case 'info': return { ...styles.alert, ...styles.alertInfo };
      default: return styles.alert;
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Contact Us</h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <div style={styles.card}>
            <div style={styles.cardBody}>
              <h2 style={styles.sectionTitle}>Get in Touch</h2>
              <p style={{ marginBottom: '2rem', lineHeight: '1.6', color: '#4a5568' }}>
                Have questions or feedback? We'd love to hear from you. Fill out the form
                and we'll get back to you as soon as possible.
              </p>

              <div style={styles.contactInfo}>
                <h3 style={styles.sectionTitle}>Contact Information</h3>
                <p style={{ marginBottom: '1rem' }}>
                  <span style={styles.icon}>✉️</span>
                  support@taskmoren.com
                </p>
               
               
              </div>

            </div>
          </div>
        </div>

        <div style={{ flex: '1', minWidth: '300px' }}>
          <div style={styles.card}>
            <div style={styles.cardBody}>
              <h2 style={styles.sectionTitle}>Send us a Message</h2>
              
              {status.message && (
                <div style={getAlertStyle()} role="alert">
                  {status.message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label htmlFor="name" style={styles.formLabel}>Name</label>
                  <input
                    type="text"
                    style={styles.formControl}
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label htmlFor="email" style={styles.formLabel}>Email</label>
                  <input
                    type="email"
                    style={styles.formControl}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label htmlFor="subject" style={styles.formLabel}>Subject</label>
                  <input
                    type="text"
                    style={styles.formControl}
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label htmlFor="message" style={styles.formLabel}>Message</label>
                  <textarea
                    style={{ ...styles.formControl, ...styles.textArea }}
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button type="submit" style={styles.submitButton}>
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;