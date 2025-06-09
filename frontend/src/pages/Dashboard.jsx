import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    highPriorityTasks: 0,
    totalSchedules: 0,
    highPrioritySchedules: 0,
    meetingSchedules: 0,
    reminderSchedules: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [recentSchedules, setRecentSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [tasksResponse, schedulesResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/tasks'),
        axios.get('http://localhost:5000/api/schedules')
      ]);

      const tasks = tasksResponse.data;
      const schedules = schedulesResponse.data;
      
      // Calculate statistics
      const newStats = {
        totalTasks: tasks.length,
        completedTasks: tasks.filter(task => task.status === 'completed').length,
        pendingTasks: tasks.filter(task => task.status === 'pending').length,
        inProgressTasks: tasks.filter(task => task.status === 'in-progress').length,
        highPriorityTasks: tasks.filter(task => task.priority === 'high').length,
        totalSchedules: schedules.length,
        highPrioritySchedules: schedules.filter(schedule => schedule.priority === 'high').length,
        meetingSchedules: schedules.filter(schedule => schedule.type === 'meeting').length,
        reminderSchedules: schedules.filter(schedule => schedule.type === 'reminder').length,
      };

      // Get recent tasks (last 5)
      const recentTasks = [...tasks]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      // Get recent schedules (last 5)
      const recentSchedules = [...schedules]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setStats(newStats);
      setRecentTasks(recentTasks);
      setRecentSchedules(recentSchedules);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Error loading dashboard data');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div>
      <h1 className="h2 mb-4">Dashboard</h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body py-1">
              <h6 className="card-title mb-0" style={{ fontSize: '0.9rem' }}>Total Tasks</h6>
              <p className="card-text" style={{ fontSize: '2rem' }}>{stats.totalTasks}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body py-1">
              <h6 className="card-title mb-0" style={{ fontSize: '0.9rem' }}>Completed Tasks</h6>
              <p className="card-text" style={{ fontSize: '2rem' }}>{stats.completedTasks}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-dark">
            <div className="card-body py-1">
              <h6 className="card-title mb-0" style={{ fontSize: '0.9rem' }}>In Progress Tasks</h6>
              <p className="card-text" style={{ fontSize: '2rem' }}>{stats.inProgressTasks}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-danger text-white">
            <div className="card-body py-1">
              <h6 className="card-title mb-0" style={{ fontSize: '0.9rem' }}>High Priority Tasks</h6>
              <p className="card-text" style={{ fontSize: '2rem' }}>{stats.highPriorityTasks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Statistics */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body py-1">
              <h6 className="card-title mb-0" style={{ fontSize: '0.9rem' }}>Total Schedules</h6>
              <p className="card-text" style={{ fontSize: '2rem' }}>{stats.totalSchedules}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body py-1">
              <h6 className="card-title mb-0" style={{ fontSize: '0.9rem' }}>Meetings</h6>
              <p className="card-text" style={{ fontSize: '2rem' }}>{stats.meetingSchedules}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-dark">
            <div className="card-body py-1">
              <h6 className="card-title mb-0" style={{ fontSize: '0.9rem' }}>Reminders</h6>
              <p className="card-text" style={{ fontSize: '2rem' }}>{stats.reminderSchedules}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-danger text-white">
            <div className="card-body py-1">
              <h6 className="card-title mb-0" style={{ fontSize: '0.9rem' }}>High Priority Schedules</h6>
              <p className="card-text" style={{ fontSize: '2rem' }}>{stats.highPrioritySchedules}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Tasks</h5>
              <Link to="/tasks" className="btn btn-sm btn-primary">
                View All
              </Link>
            </div>
            <div className="card-body">
              {recentTasks.length === 0 ? (
                <p className="text-muted">No tasks found</p>
              ) : (
                <div className="list-group">
                  {recentTasks.map(task => (
                    <Link
                      key={task._id}
                      to={`/tasks/${task._id}`}
                      className="list-group-item list-group-item-action"
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h6 className="mb-1">{task.title}</h6>
                        <small>
                          <span className={`badge bg-${
                            task.status === 'completed' ? 'success' :
                            task.status === 'in-progress' ? 'warning' : 'secondary'
                          }`}>
                            {task.status}
                          </span>
                        </small>
                      </div>
                      <p className="mb-1 text-muted">{task.description}</p>
                      <small>
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </small>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <Link to="/tasks/new" className="btn btn-primary">
                  Add New Task
                </Link>
                <Link to="/tasks" className="btn btn-outline-primary">
                  View All Tasks
                </Link>
                <Link to="/schedule-plan" className="btn btn-primary">
                  Add New Schedule
                </Link>
                <Link to="/schedule-plan" className="btn btn-outline-primary">
                  View All Schedules
                </Link>
                <Link to="/notifications" className="btn btn-outline-primary">
                  View Notifications
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Schedules Section */}
      <div className="row mt-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Schedules</h5>
              <Link to="/schedule-plan" className="btn btn-sm btn-primary">
                View All
              </Link>
            </div>
            <div className="card-body">
              {recentSchedules.length === 0 ? (
                <p className="text-muted">No schedules found</p>
              ) : (
                <div className="list-group">
                  {recentSchedules.map(schedule => (
                    <Link
                      key={schedule._id}
                      to={`/schedule-plan/${schedule._id}`}
                      className="list-group-item list-group-item-action"
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h6 className="mb-1">{schedule.title}</h6>
                        <small>
                          <span className={`badge bg-${
                            schedule.priority === 'high' ? 'danger' :
                            schedule.priority === 'medium' ? 'warning' : 'secondary'
                          }`}>
                            {schedule.priority}
                          </span>
                        </small>
                      </div>
                      <p className="mb-1 text-muted">{schedule.description}</p>
                      <small>
                        Date: {new Date(schedule.date).toLocaleDateString()}
                        {schedule.startTime && ` | Start: ${schedule.startTime}`}
                        {schedule.endTime && ` | End: ${schedule.endTime}`}
                      </small>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;