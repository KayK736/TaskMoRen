import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { generateSchedulePDF } from '../utils/pdfGenerator';
import './SchedulePlan.css';

const SchedulePlan = () => {
  const [schedules, setSchedules] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    type: 'other',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/schedules');
      setSchedules(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch schedules');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const scheduleData = {
        ...formData,
        ...(formData.endTime ? { endTime: formData.endTime } : {})
      };

      await axios.post('http://localhost:5000/api/schedules', scheduleData);
      setSuccess('Schedule created successfully');
      setFormData({
        title: '',
        description: '',
        date: '',
        startTime: '',
        endTime: '',
        type: 'other',
        priority: 'medium'
      });
      fetchSchedules();
    } catch (error) {
      console.error('Error creating schedule:', error);
      setError(error.response?.data?.message || 'Error creating schedule');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await axios.delete(`http://localhost:5000/api/schedules/${id}`);
        setSuccess('Schedule deleted successfully');
        fetchSchedules();
      } catch (error) {
        console.error('Error deleting schedule:', error);
        setError('Error deleting schedule');
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'meeting':
        return '👥';
      case 'task':
        return '✓';
      case 'reminder':
        return '⏰';
      default:
        return '📝';
    }
  };

  const handleExportPDF = async () => {
    try {
      if (!schedules || schedules.length === 0) {
        setError('No schedules available to export');
        return;
      }
      generateSchedulePDF(schedules);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError(err.message || 'Failed to generate PDF');
    }
  };

  const handleEditSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setShowModal(true);
  };

  const filteredSchedules = schedules.filter(schedule => {
    if (filter === 'all') return true;
    return schedule.type === filter;
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <h1>Schedule Plan</h1>
        <div className="schedule-actions">
          <button className="btn-export" onClick={handleExportPDF}>
            Export PDF
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger fade-in" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success fade-in" role="alert">
          {success}
        </div>
      )}

      <div className="task-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === 'meeting' ? 'active' : ''}`}
          onClick={() => setFilter('meeting')}
        >
          Meeting
        </button>
        <button
          className={`filter-btn ${filter === 'task' ? 'active' : ''}`}
          onClick={() => setFilter('task')}
        >
          Task
        </button>
        <button
          className={`filter-btn ${filter === 'reminder' ? 'active' : ''}`}
          onClick={() => setFilter('reminder')}
        >
          Reminder
        </button>
        <button
          className={`filter-btn ${filter === 'other' ? 'active' : ''}`}
          onClick={() => setFilter('other')}
        >
          Other
        </button>
      </div>

      <div className="schedule-grid">
        <div className="schedule-form-container">
          <div className="schedule-form-card">
            <div className="schedule-form-header">
              <h3>Add New Schedule</h3>
            </div>
            <div className="schedule-form-body">
              <form onSubmit={handleSubmit} className="schedule-form">
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter schedule title"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Enter schedule description"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="startTime">Start Time</label>
                    <input
                      type="time"
                      className="form-control"
                      id="startTime"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="endTime">End Time (Optional)</label>
                  <input
                    type="time"
                    className="form-control"
                    id="endTime"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="type">Type</label>
                    <select
                      className="form-control"
                      id="type"
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
                    <label htmlFor="priority">Priority</label>
                    <select
                      className="form-control"
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn-submit">
                  Add Schedule
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="schedule-list-container">
          <div className="schedule-list-card">
            <div className="schedule-list-header">
              <h3>Your Schedules</h3>
            </div>
            <div className="schedule-list-body">
              {filteredSchedules.length === 0 ? (
                <div className="empty-state">
                  <p>No schedules found</p>
                  <p className="empty-state-sub">Add a new schedule to get started</p>
                </div>
              ) : (
                <div className="schedule-list">
                  {filteredSchedules.map(schedule => (
                    <div key={schedule._id} className="schedule-item">
                      <div className="schedule-item-header">
                        <div className="schedule-item-title">
                          <span className="schedule-type-icon">
                            {getTypeIcon(schedule.type)}
                          </span>
                          <h4>{schedule.title}</h4>
                        </div>
                        <span className={`priority-badge priority-${getPriorityColor(schedule.priority)}`}>
                          {schedule.priority}
                        </span>
                      </div>
                      <p className="schedule-description">{schedule.description}</p>
                      <div className="schedule-details">
                        <div className="schedule-time">
                          <span className="detail-label">Date:</span>
                          <span>{new Date(schedule.date).toLocaleDateString()}</span>
                        </div>
                        <div className="schedule-time">
                          <span className="detail-label">Time:</span>
                          <span>
                            {schedule.startTime}
                            {schedule.endTime ? ` - ${schedule.endTime}` : ''}
                          </span>
                        </div>
                        <div className="schedule-type">
                          <span className="detail-label">Type:</span>
                          <span>{schedule.type}</span>
                        </div>
                      </div>
                      <div className="schedule-actions">
                        <button
                          className="btn-view"
                          onClick={() => handleEditSchedule(schedule)}
                        >
                          View
                        </button>
                        <button
                          className="btn-edit"
                          onClick={() => handleEditSchedule(schedule)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(schedule._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Schedule Modal */}
      {showModal && selectedSchedule && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Schedule</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                await axios.put(`http://localhost:5000/api/schedules/${selectedSchedule._id}`, selectedSchedule);
                setSuccess('Schedule updated successfully');
                setShowModal(false);
                fetchSchedules();
              } catch (error) {
                console.error('Error updating schedule:', error);
                setError('Error updating schedule');
              }
            }}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedSchedule.title}
                  onChange={(e) => setSelectedSchedule({ ...selectedSchedule, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  value={selectedSchedule.description}
                  onChange={(e) => setSelectedSchedule({ ...selectedSchedule, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={selectedSchedule.date ? new Date(selectedSchedule.date).toISOString().split('T')[0] : ''}
                  onChange={(e) => setSelectedSchedule({ ...selectedSchedule, date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Start Time</label>
                <input
                  type="time"
                  className="form-control"
                  value={selectedSchedule.startTime}
                  onChange={(e) => setSelectedSchedule({ ...selectedSchedule, startTime: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Time (Optional)</label>
                <input
                  type="time"
                  className="form-control"
                  value={selectedSchedule.endTime || ''}
                  onChange={(e) => setSelectedSchedule({ ...selectedSchedule, endTime: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select
                  className="form-control"
                  value={selectedSchedule.type}
                  onChange={(e) => setSelectedSchedule({ ...selectedSchedule, type: e.target.value })}
                >
                  <option value="meeting">Meeting</option>
                  <option value="task">Task</option>
                  <option value="reminder">Reminder</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select
                  className="form-control"
                  value={selectedSchedule.priority}
                  onChange={(e) => setSelectedSchedule({ ...selectedSchedule, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-submit">Save Changes</button>
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePlan; 