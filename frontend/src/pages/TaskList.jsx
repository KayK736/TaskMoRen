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

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="task-list-container">
      <div className="task-header">
        <h1>Task List</h1>
        <div className="task-actions">
          <button className="btn-export" onClick={handleExportPDF}>
            Export PDF
          </button>
        </div>
      </div>

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

      <div className="task-grid-container">
        <div className="task-form-container">
          <div className="task-form-card">
            <div className="task-form-header">
              <h3>Add New Task</h3>
            </div>
            <div className="task-form-body">
              <form onSubmit={handleSubmit} className="task-form">
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

        <div className="task-list">
          {filteredTasks.map(task => (
            <div key={task._id} className="task-card">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <div className="task-meta">
                <span className={`status ${task.status}`}>{task.status}</span>
                <span className={`priority ${task.priority}`}>{task.priority}</span>
              </div>
              <div className="task-footer">
                <span className="due-date">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
                <Link to={`/tasks/${task._id}`} className="btn-view">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
