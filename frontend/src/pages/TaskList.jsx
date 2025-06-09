import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { generateTaskPDF } from '../utils/pdfGenerator';
import './TaskList.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'pending'
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [dateError, setDateError] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch tasks');
      setLoading(false);
    }
  };

  const validateDate = (date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setDateError('Due date cannot be in the past');
      return false;
    }
    setDateError('');
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'dueDate') {
      validateDate(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validateDate(formData.dueDate)) {
      return;
    }

    setFormLoading(true);
    try {
      await axios.post('http://localhost:5000/api/tasks', formData);
      setFormLoading(false);
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        status: 'pending'
      });
      fetchTasks(); // Refresh tasks after adding a new one
    } catch (error) {
      console.error('Error saving task:', error);
      setFormError('Error saving task');
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`http://localhost:5000/api/tasks/${id}`);
        fetchTasks(); // Refresh tasks after deletion
      } catch (error) {
        console.error('Error deleting task:', error);
        setError('Error deleting task');
      }
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleExportPDF = async () => {
    try {
      if (!tasks || tasks.length === 0) {
        setError('No tasks available to export');
        return;
      }
      generateTaskPDF(tasks);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError(err.message || 'Failed to generate PDF');
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <h1>Task List</h1>
        <div className="schedule-actions">
          <button className="btn-export" onClick={handleExportPDF}>
            Export PDF
          </button>
        </div>
      </div>

      {formError && (
        <div className="alert alert-danger fade-in" role="alert">
          {formError}
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
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button
          className={`filter-btn ${filter === 'in-progress' ? 'active' : ''}`}
          onClick={() => setFilter('in-progress')}
        >
          In Progress
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      <div className="schedule-grid">
        <div className="schedule-form-container">
          <div className="schedule-form-card">
            <div className="schedule-form-header">
              <h3>Add New Task</h3>
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
                    placeholder="Enter task title"
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
                    placeholder="Enter task description"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dueDate">Due Date</label>
                  <input
                    type="date"
                    className={`form-control ${dateError ? 'is-invalid' : ''}`}
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                  {dateError && (
                    <div className="invalid-feedback">
                      {dateError}
                    </div>
                  )}
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

                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    className="form-control"
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn-submit"
                  disabled={formLoading || !!dateError}
                >
                  {formLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Adding...
                    </>
                  ) : (
                    'Add Task'
                  )}
                </button>
              </form>
              {formError && <div className="alert alert-danger mt-3">{formError}</div>}
            </div>
          </div>
        </div>

        <div className="schedule-list-container">
          <div className="schedule-list-card">
            <div className="schedule-list-header">
              <h3>Your Tasks</h3>
            </div>
            <div className="schedule-list-body">
              {filteredTasks.length === 0 ? (
                <div className="empty-state">
                  <p>No tasks found</p>
                  <p className="empty-state-sub">Add a new task to get started</p>
                </div>
              ) : (
                <div className="schedule-list">
                  {filteredTasks.map(task => (
                    <div key={task._id} className="schedule-item">
                      <div className="schedule-item-header">
                        <div className="schedule-item-title">
                          <h4>{task.title}</h4>
                        </div>
                        <span className={`priority-badge priority-${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="schedule-description">{task.description}</p>
                      <div className="schedule-details">
                        <div className="schedule-time">
                          <span className="detail-label">Due:</span>
                          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div className="schedule-type">
                          <span className="detail-label">Status:</span>
                          <span>{task.status}</span>
                        </div>
                      </div>
                      <div className="schedule-actions">
                        <button
                          className="btn-view"
                          onClick={() => console.log('View task', task._id)}
                        >
                          View
                        </button>
                        <button
                          className="btn-edit"
                          onClick={() => handleEditTask(task)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(task._id)}
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

      {/* Edit Task Modal */}
      {showModal && selectedTask && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Task</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                await axios.put(`http://localhost:5000/api/tasks/${selectedTask._id}`, selectedTask);
                // setSuccess('Task updated successfully'); // Removed to avoid interfering with current message flow
                setShowModal(false);
                fetchTasks();
              } catch (error) {
                console.error('Error updating task:', error);
                // setError('Error updating task'); // Removed to avoid interfering with current message flow
              }
            }}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedTask.title}
                  onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  value={selectedTask.description}
                  onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={selectedTask.dueDate ? new Date(selectedTask.dueDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setSelectedTask({ ...selectedTask, dueDate: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select
                  className="form-control"
                  value={selectedTask.priority}
                  onChange={(e) => setSelectedTask({ ...selectedTask, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  className="form-control"
                  value={selectedTask.status}
                  onChange={(e) => setSelectedTask({ ...selectedTask, status: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
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

export default TaskList;
