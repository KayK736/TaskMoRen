import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ScheduleEditModal.css';

const ScheduleEditModal = ({ showModal, setShowModal, schedule, fetchSchedules, token }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    type: 'other',
    priority: 'medium',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (schedule) {
      setFormData({
        title: schedule.title || '',
        description: schedule.description || '',
        date: schedule.date ? new Date(schedule.date).toISOString().split('T')[0] : '',
        startTime: schedule.startTime || '',
        endTime: schedule.endTime || '',
        type: schedule.type || 'other',
        priority: schedule.priority || 'medium',
      });
    }
  }, [schedule]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const scheduleData = {
        ...formData,
        ...(formData.endTime ? { endTime: formData.endTime } : {})
      };

      await axios.put(`http://localhost:5000/api/schedules/${schedule._id}`, scheduleData, config);
      setLoading(false);
      setShowModal(false);
      fetchSchedules(); // Refresh schedules after update
    } catch (err) {
      console.error('Error updating schedule:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Error updating schedule');
      setLoading(false);
    }
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Schedule</h2>
          <button className="close-button" onClick={() => setShowModal(false)}>&times;</button>
        </div>
        <div className="modal-body">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="edit-schedule-title">Title</label>
              <input
                type="text"
                id="edit-schedule-title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-schedule-description">Description</label>
              <textarea
                id="edit-schedule-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="edit-schedule-date">Date</label>
              <input
                type="date"
                id="edit-schedule-date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-schedule-startTime">Start Time</label>
              <input
                type="time"
                id="edit-schedule-startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-schedule-endTime">End Time (Optional)</label>
              <input
                type="time"
                id="edit-schedule-endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-schedule-type">Type</label>
              <select
                id="edit-schedule-type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="meeting">Meeting</option>
                <option value="task">Task</option>
                <option value="reminder">Reminder</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="edit-schedule-priority">Priority</label>
              <select
                id="edit-schedule-priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleEditModal; 