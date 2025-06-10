import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TaskList from './pages/TaskList';
import TaskForm from './pages/TaskForm';
import TaskDetail from './pages/TaskDetail';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import SchedulePlan from './pages/SchedulePlan';
import MyFirst from './pages/myFirst';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MyFirst />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="tasks" element={<TaskList />} />
                  <Route path="add-task" element={<TaskForm />} />
                  <Route path="tasks/:id" element={<TaskDetail />} />
                  <Route path="tasks/:id/edit" element={<TaskForm />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="about-us" element={<AboutUs />} />
                  <Route path="contact-us" element={<ContactUs />} />
                  <Route path="schedule-plan" element={<SchedulePlan />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
