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
          <Link to="/tasks/new" className="btn-add-task">
            Add Task
          </Link>
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

      <div className="task-grid">
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
  );
};

export default TaskList;
