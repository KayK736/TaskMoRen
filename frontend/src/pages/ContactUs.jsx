import React, { useState } from 'react';

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
      // Here you would typically send the form data to your backend
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus({
        type: 'success',
        message: 'Thank you for your message! We will get back to you soon.'
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus({
        type: 'danger',
        message: 'Sorry, there was an error sending your message. Please try again.'
      });
    }
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Contact Us</h1>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h4 mb-3">Get in Touch</h2>
              <p className="mb-4">
                Have questions or feedback? We'd love to hear from you. Fill out the form
                and we'll get back to you as soon as possible.
              </p>

              <div className="mb-4">
                <h3 className="h5">Contact Information</h3>
                <p className="mb-2">
                  <i className="bi bi-envelope me-2"></i>
                  support@taskmoren.com
                </p>
                <p className="mb-2">
                  <i className="bi bi-telephone me-2"></i>
                  +1 (555) 123-4567
                </p>
                <p className="mb-0">
                  <i className="bi bi-geo-alt me-2"></i>
                  123 Task Street, Productivity City, PC 12345
                </p>
              </div>

              <div>
                <h3 className="h5">Business Hours</h3>
                <p className="mb-2">Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p className="mb-0">Saturday - Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="h4 mb-3">Send us a Message</h2>
              
              {status.message && (
                <div className={`alert alert-${status.type}`} role="alert">
                  {status.message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">Subject</label>
                  <input
                    type="text"
                    className="form-control"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary">
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