import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { generateSchedulePDF } from '../utils/pdfGenerator';
import './SchedulePlan.css';
import { AuthContext } from '../context/AuthContext';

const SchedulePlan = () => {
  const { token } = useContext(AuthContext);
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
    if (token) {
      fetchSchedules();
    }
  }, [token]);

  const fetchSchedules = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get('http://localhost:5000/api/schedules', config);
      setSchedules(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch schedules:', err);
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
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const scheduleData = {
        ...formData,
        ...(formData.endTime ? { endTime: formData.endTime } : {})
      };

      await axios.post('http://localhost:5000/api/schedules', scheduleData, config);
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
      console.error('Error creating schedule:', error.response?.data?.message || error.message);
      setError(error.response?.data?.message || 'Error creating schedule');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.delete(`http://localhost:5000/api/schedules/${id}`, config);
        setSuccess('Schedule deleted successfully');
        fetchSchedules();
      } catch (error) {
        console.error('Error deleting schedule:', error.response?.data?.message || error.message);
        setError('Error deleting schedule: ' + (error.response?.data?.message || 'Server error'));
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
                  ></textarea>
                </div>

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

                <button type="submit" className="btn btn-primary">
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
                <p className="text-muted text-center">No schedules found.</p>
              ) : (
                <ul className="list-group">
                  {filteredSchedules.map(schedule => (
                    <li key={schedule._id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <h5>{getTypeIcon(schedule.type)} {schedule.title}</h5>
                        <p className="mb-1">{schedule.description}</p>
                        <small className="text-muted">
                          {new Date(schedule.date).toLocaleDateString()} | {schedule.startTime}{schedule.endTime && ` - ${schedule.endTime}`} | Priority: <span className={`badge bg-${getPriorityColor(schedule.priority)}`}>{schedule.priority}</span>
                        </small>
                      </div>
                      <div>
                        <button className="btn btn-sm btn-info me-2" onClick={() => handleEditSchedule(schedule)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(schedule._id)}>Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Edit Modal */}
      {showModal && selectedSchedule && (
        <ScheduleEditModal
          showModal={showModal}
          setShowModal={setShowModal}
          schedule={selectedSchedule}
          fetchSchedules={fetchSchedules}
          token={token}
        />
      )}
    </div>
  );
};

export default SchedulePlan; 