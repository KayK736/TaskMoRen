import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/tasks/${id}`);
      setTask(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching task:', error);
      setError('Error loading task details');
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${id}`, 
        { ...task, status: newStatus }
      );
      fetchTask();
    } catch (error) {
      console.error('Error updating task status:', error);
      setError('Error updating task status');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`http://localhost:5000/api/tasks/${id}`);
        navigate('/tasks');
      } catch (error) {
        console.error('Error deleting task:', error);
        setError('Error deleting task');
      }
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/tasks/${id}/pdf`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `task-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setError('Error downloading PDF');
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!task) {
    return <div className="alert alert-danger">Task not found</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2">{task.title}</h1>
        <div className="btn-group">
          <button
            className="btn btn-outline-primary"
            onClick={() => navigate(`/tasks/${id}/edit`)}
          >
            Edit
          </button>
          <button
            className="btn btn-outline-danger"
            onClick={handleDelete}
          >
            Delete
          </button>
          <button
            className="btn btn-outline-info"
            onClick={handleDownloadPDF}
          >
            Download PDF
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header">
              <h3 className="h5 mb-0">Task Details</h3>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <h4 className="h6">Description</h4>
                <p className="mb-0">{task.description}</p>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <h4 className="h6">Status</h4>
                    <select
                      className="form-select"
                      value={task.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <h4 className="h6">Priority</h4>
                    <p className="mb-0">
                      <span className={`badge bg-${
                        task.priority === 'high' ? 'danger' :
                        task.priority === 'medium' ? 'warning' : 'info'
                      }`}>
                        {task.priority}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <h4 className="h6">Created At</h4>
                    <p className="mb-0">{new Date(task.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <h4 className="h6">Due Date</h4>
                    <p className="mb-0">{new Date(task.dueDate).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h3 className="h5 mb-0">Task Actions</h3>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/tasks/${id}/edit`)}
                >
                  Edit Task
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={handleDelete}
                >
                  Delete Task
                </button>
                <button
                  className="btn btn-outline-info"
                  onClick={handleDownloadPDF}
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;