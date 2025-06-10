import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

const Profile = () => {
  const { user, token, logout, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePictureChange = (e) => {
    setProfilePictureFile(e.target.files[0]);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user) {
      setError('No user logged in.');
      return;
    }

    try {
      const updateData = {
        name: formData.name,
      };

      await axios.put('http://localhost:5000/api/users/profile', updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (profilePictureFile) {
        const formData = new FormData();
        formData.append('profilePicture', profilePictureFile);

        const uploadResponse = await axios.post('http://localhost:5000/api/users/profile/picture', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        login({ ...user, profilePicture: uploadResponse.data.profilePicture }, token);
      }
      
      setSuccess('Profile updated successfully');
      if (user) user.name = formData.name;

    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Error updating profile');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user) {
      setError('No user logged in.');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (!formData.currentPassword) {
      setError('Current password is required to set a new password');
      return;
    }

    try {
      const updateData = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      };

      await axios.put('http://localhost:5000/api/users/profile/password', updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess('Password updated successfully');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

    } catch (error) {
      console.error('Error changing password:', error);
      setError(error.response?.data?.message || 'Error changing password');
    }
  };

  const handleDeleteAccount = async () => {
    setError('');
    setSuccess('');
    setShowDeleteConfirmation(false);

    if (!user) {
      setError('No user logged in.');
      return;
    }

    try {
      await axios.delete('http://localhost:5000/api/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess('Account deleted successfully. Redirecting to login...');
      logout();
      navigate('/login');

    } catch (error) {
      console.error('Error deleting account:', error);
      setError(error.response?.data?.message || 'Error deleting account');
    }
  };

  if (!user) {
    return <div className="text-center">Please log in to view your profile.</div>;
  }

  return (
    <div>
      <div className="schedule-header">
        <h1>Profile Settings</h1>
        <div className="schedule-actions">
          <button className="btn-export" onClick={() => setShowSettings(!showSettings)}>
            {showSettings ? 'Back to Profile' : 'Settings'}
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}

      {!showSettings ? (
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="card mb-4">
              <div className="card-header">
                <h3 className="h5 mb-0">Your Profile</h3>
              </div>
              <div className="card-body">
                <div className="profile-display-item profile-avatar-display">
                  {user.profilePicture ? (
                    <img src={`http://localhost:5000${user.profilePicture}`} alt="Profile" className="profile-img-preview" />
                  ) : (
                    <div className="profile-avatar-placeholder">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                </div>
                <div className="profile-display-item">
                  <strong>Name:</strong> {user.name}
                </div>
                <div className="profile-display-item">
                  <strong>Email:</strong> {user.email}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="card mb-4">
              <div className="card-header">
                <h3 className="h5 mb-0">Edit Profile Information</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleProfileUpdate}>
                  <div className="mb-3 text-center">
                    {user.profilePicture ? (
                      <img src={`http://localhost:5000${user.profilePicture}`} alt="Profile" className="profile-img-preview" />
                    ) : (
                      <div className="profile-avatar-placeholder">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                    <label htmlFor="profilePicture" className="form-label mt-2">Change Profile Picture</label>
                    <input
                      type="file"
                      className="form-control"
                      id="profilePicture"
                      name="profilePicture"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                    />
                  </div>
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
                      value={user.email}
                      readOnly
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Update Profile
                  </button>
                </form>

                <hr className="my-4" />

                <h4 className="h5 mb-3">Change Password</h4>
                <form onSubmit={handlePasswordChange}>
                  <div className="mb-3">
                    <label htmlFor="currentPassword" className="form-label">Current Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>

                  <button type="submit" className="btn btn-warning">
                    Change Password
                  </button>
                </form>

                <hr className="my-4" />

                <h4 className="h5 mb-3">Account Management</h4>
                <button 
                  className="btn btn-danger" 
                  onClick={() => setShowDeleteConfirmation(true)}
                >
                  Delete Account
                </button>

                {showDeleteConfirmation && (
                  <div className="alert alert-warning mt-3">
                    <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                    <button className="btn btn-danger me-2" onClick={handleDeleteAccount}>
                      Yes, Delete My Account
                    </button>
                    <button className="btn btn-secondary" onClick={() => setShowDeleteConfirmation(false)}>
                      Cancel
                    </button>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile; 