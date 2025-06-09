import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks');
      const tasks = response.data;

      // Create notifications for tasks
      const taskNotifications = tasks.map(task => {
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

        let message = '';
        let type = 'info';

        if (task.status === 'completed') {
          message = `Task "${task.title}" has been completed`;
          type = 'success';
        } else if (daysUntilDue < 0) {
          message = `Task "${task.title}" is overdue by ${Math.abs(daysUntilDue)} days`;
          type = 'danger';
        } else if (daysUntilDue === 0) {
          message = `Task "${task.title}" is due today`;
          type = 'warning';
        } else if (daysUntilDue <= 3) {
          message = `Task "${task.title}" is due in ${daysUntilDue} days`;
          type = 'warning';
        }

        return {
          id: task._id,
          message,
          type,
          createdAt: task.updatedAt || task.createdAt,
          taskId: task._id
        };
      }).filter(notification => notification.message !== '');

      // Sort notifications by date (newest first)
      const sortedNotifications = taskNotifications.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setNotifications(sortedNotifications);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Error loading notifications');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div>
      <h1 className="h2 mb-4">Notifications</h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="alert alert-info">
          No notifications at this time
        </div>
      ) : (
        <div className="list-group">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`list-group-item list-group-item-${notification.type}`}
            >
              <div className="d-flex w-100 justify-content-between">
                <p className="mb-1">{notification.message}</p>
                <small>
                  {new Date(notification.createdAt).toLocaleString()}
                </small>
              </div>
              <Link
                to={`/tasks/${notification.taskId}`}
                className="btn btn-sm btn-outline-primary mt-2"
              >
                View Task
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications; 