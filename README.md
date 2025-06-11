# 🚀 TaskMoRen: Modern Task & Schedule Management


> **Your all-in-one solution for effortless task management and productivity enhancement**

## 📋 Table of Contents
- [✨ Key Features](#-key-features)
- [⚙️ Installation Guide](#%EF%B8%8F-installation-guide)
- [🚦 Usage](#-usage)
- [👨‍💻 Admin Access](#-admin-access)
- [📜 License](#-license)

## ✨ Key Features

### 👤 User Features
| Feature | Description |
|---------|-------------|
| 📝 **Task Management** | Create, organize, and track tasks with statuses (✅ Pending, 🚧 In-Progress, ✔️ Completed) |
| 🗓 **Schedule Planning** | Visual calendar for meetings, deadlines, and reminders |
| 👤 **User Profiles** | Personalized profiles with avatar support |


### 👑 Admin Features
| Feature | Description |
|---------|-------------|
| 👥 **User Management** | Full CRUD operations for user accounts |
| 📊 **Reporting** | Generate comprehensive PDF reports |
| ✉️ **Message Center** | Manage all contact form submissions |
| 🔒 **Secure Dashboard** | Protected admin-only routes |

## ⚙️ Installation Guide

### Prerequisites
- Node.js v14+ [Download](https://nodejs.org/)
- npm v6+ or Yarn
- MongoDB [Install Guide](https://www.mongodb.com/docs/manual/installation/)

### 🖥 Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Configure environment
echo "MONGO_URI=mongodb://localhost:27017/taskmoren
JWT_SECRET=your_secure_secret_here
PORT=5000" > .env

# 4. Create admin account
node scripts/createAdmin.js

# 5. Start server
npm start


# 1. Navigate to frontend
cd ../frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev


future development
| 🔔 **Notifications** | Real-time alerts for important updates |