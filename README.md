# TaskMoRen: Task and Schedule Management Application

TaskMoRen is a comprehensive application designed to help users manage their tasks and schedules efficiently. It features a robust backend (Node.js with Express and MongoDB) and a dynamic frontend (React), providing a seamless experience for personal productivity and administrative oversight.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Admin Access](#admin-access)

## Features

### User Features
- **Task Management**: Create, view, edit, and delete tasks. Categorize tasks by status (pending, in-progress, completed).
- **Schedule Planning**: Plan and manage schedules, including meetings and reminders.
- **User Profile**: View and manage personal profile information, including profile photos.
- **Notifications**: Receive and manage application notifications.

### Admin Features
- **User Management**: View all registered users, edit their information, and manage account status (activate/deactivate).
- **User Report Generation**: Generate PDF reports of all user data.
- **Contact Message Management**: View messages submitted through the contact form directly from the admin dashboard.
- **Secure Admin Login**: Dedicated login for administrators with protected routes.

## Installation

To set up and run TaskMoRen locally, follow these steps:

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher) or Yarn
- MongoDB (local installation or cloud-hosted service like MongoDB Atlas)

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install backend dependencies:**
    ```bash
    npm install
    # or yarn install
    ```

3.  **Create a `.env` file:**
    In the `backend` directory, create a file named `.env` and add the following content:
    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    PORT=5000
    ```
    - Replace `your_mongodb_connection_string` with your MongoDB connection URI (e.g., `mongodb://localhost:27017/taskmoren` or your MongoDB Atlas URI).
    - Replace `your_jwt_secret_key` with a strong, random string.

4.  **Create Admin Account:**
    After setting up the `.env` file and ensuring MongoDB is running, create the default admin account by running:
    ```bash
    node scripts/createAdmin.js
    ```
    The default admin credentials are:
    - Username: `kay625`
    - Password: `kay123`

5.  **Start the backend server:**
    ```bash
    npm start
    # or yarn start
    ```
    The backend server will run on `http://localhost:5000` (or the PORT specified in your .env file).

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    ```

2.  **Install frontend dependencies:**
    ```bash
    npm install
    # or yarn install
    ```

3.  **Start the frontend development server:**
    ```bash
    npm run dev
    # or yarn dev
    ```
    The frontend application will typically open in your browser at `http://localhost:5173`.

## Usage

- Open your browser and navigate to the frontend URL (e.g., `http://localhost:5173`).
- Register a new user or log in with existing credentials.
- Explore the task and schedule management features.

### Admin Access

- To access the admin dashboard, navigate to `http://localhost:5173/admin/login`.
- Use the default admin credentials (username: `kay625`, password: `kay123`) to log in.
- From the admin dashboard, you can manage users, generate reports, and view contact messages.
