import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Admin.css'; // Import the new Admin CSS file
import ConfirmationModal from './ConfirmationModal';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [contactMessages, setContactMessages] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [confirmAction, setConfirmAction] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
        fetchContactMessages();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/');
    };

    const handleGeneratePdf = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            // Open in a new tab to trigger download
            window.open(`http://localhost:5000/api/admin/users/report?token=${token}`, '_blank');
        } catch (error) {
            console.error('Error generating PDF report:', error);
            alert('Failed to generate PDF report.');
        }
    };

    const fetchUsers = async () => {
        console.log('Attempting to fetch users...');
        try {
            const token = localStorage.getItem('adminToken');
            console.log('Admin token found:', !!token);
            const response = await axios.get('http://localhost:5000/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Users fetched from backend:', response.data);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error.response?.data || error.message);
            if (error.response?.status === 401) {
                navigate('/admin/login');
            }
        }
    };

    const fetchContactMessages = async () => {
        console.log('Attempting to fetch contact messages...');
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get('http://localhost:5000/api/contact/admin', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Contact messages fetched from backend:', response.data);
            setContactMessages(response.data);
        } catch (error) {
            console.error('Error fetching contact messages:', error.response?.data || error.message);
            // Handle error, e.g., redirect to login if unauthorized
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(
                `http://localhost:5000/api/admin/users/${editingUser._id}`,
                editingUser,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleDelete = (userId) => {
        setConfirmMessage('Are you sure you want to disable this user?');
        setConfirmAction(() => async () => {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.put(`http://localhost:5000/api/admin/users/${userId}`, { isActive: false }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchUsers();
            } catch (error) {
                console.error('Error disabling user:', error);
            } finally {
                setShowConfirmModal(false);
            }
        });
        setShowConfirmModal(true);
    };

    const handleEnable = (userId) => {
        setConfirmMessage('Are you sure you want to enable this user?');
        setConfirmAction(() => async () => {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.put(`http://localhost:5000/api/admin/users/${userId}`, { isActive: true }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchUsers();
            } catch (error) {
                console.error('Error enabling user:', error);
            } finally {
                setShowConfirmModal(false);
            }
        });
        setShowConfirmModal(true);
    };

    const handleCancelConfirm = () => {
        setShowConfirmModal(false);
        setConfirmAction(null);
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="admin-dashboard-container bg-white p-10 rounded-xl shadow-2xl relative">
                <div className="flex justify-between items-center mb-12 border-b pb-6 border-gray-200">
                    <h1 className="admin-dashboard-title text-5xl">Admin Dashboard</h1>
                    <div className="flex gap-4">
                        <button
                            onClick={handleGeneratePdf}
                            className="admin-action-button admin-edit-button transform transition-transform duration-200 hover:scale-105"
                        >
                            Generate Report
                        </button>
                        <button
                            onClick={handleLogout}
                            className="admin-action-button admin-disable-button transform transition-transform duration-200 hover:scale-105"
                        >
                            Logout
                        </button>
                    </div>
                </div>
                
                {editingUser ? (
                    <div className="admin-edit-form-container bg-white p-8 rounded-lg shadow-xl border border-gray-100">
                        <h2 className="admin-edit-form-title text-3xl mb-8">Edit User</h2>
                        <form onSubmit={handleUpdate} className="space-y-8">
                            <div className="admin-form-group">
                                <label className="block text-lg font-medium text-gray-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    value={editingUser.name}
                                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                    className="admin-input block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg"
                                />
                            </div>
                            <div className="admin-form-group">
                                <label className="block text-lg font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={editingUser.email}
                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                    className="admin-input block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg"
                                />
                            </div>
                            <div className="admin-edit-form-actions">
                                <button
                                    type="submit"
                                    className="admin-action-button admin-save-button px-6 py-3 text-lg rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
                                    className="admin-action-button admin-cancel-button px-6 py-3 text-lg rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="admin-table-container border border-gray-200 rounded-lg shadow-xl overflow-hidden">
                        <table className="admin-table w-full">
                            <thead className="bg-gray-100 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Profile Photo</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.profilePicture ? (
                                                <img
                                                    src={`http://localhost:5000/${user.profilePicture.replace(/\\/g, '/')}`}
                                                    alt="Profile"
                                                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-medium">N/A</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={user.isActive ? 'admin-status-active' : 'admin-status-disabled'}>
                                                {user.isActive ? 'Active' : 'Disabled'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-base font-medium">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="admin-action-button admin-edit-button mr-4 px-4 py-2 text-sm rounded-md shadow-sm hover:shadow-md transition-all duration-200"
                                            >
                                                Edit
                                            </button>
                                            {user.isActive ? (
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    className="admin-action-button admin-disable-button px-4 py-2 text-sm rounded-md shadow-sm hover:shadow-md transition-all duration-200"
                                                >
                                                    Disable
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleEnable(user._id)}
                                                    className="admin-action-button admin-save-button px-4 py-2 text-sm rounded-md shadow-sm hover:shadow-md transition-all duration-200"
                                                >
                                                    Enable
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <h2 className="admin-dashboard-title text-4xl mt-16 mb-8 border-b pb-4 border-gray-200">Contact Messages</h2>
                <div className="admin-table-container border border-gray-200 rounded-lg shadow-xl overflow-hidden mb-12">
                    <table className="admin-table w-full">
                        <thead className="bg-gray-100 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Subject</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Message</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {contactMessages.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-base text-gray-500">No contact messages found.</td>
                                </tr>
                            ) : (
                                contactMessages.map((msg) => (
                                    <tr key={msg._id} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">{msg.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">{msg.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">{msg.subject}</td>
                                        <td className="px-6 py-4 text-base text-gray-800 break-words max-w-xs">{msg.message}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">{new Date(msg.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmationModal
                showModal={showConfirmModal}
                message={confirmMessage}
                onConfirm={confirmAction}
                onCancel={handleCancelConfirm}
            />
        </div>
    );
};

export default AdminDashboard; 