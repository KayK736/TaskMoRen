import React from 'react';

const AboutUs = () => {
  return (
    <div className="container py-4">
      <h1 className="mb-4">About TaskMoRen</h1>
      
      <div className="card mb-4">
        <div className="card-body">
          <h2 className="h4 mb-3">Our Mission</h2>
          <p className="lead">
            TaskMoRen is dedicated to helping individuals and teams manage their tasks efficiently and effectively.
            We believe in the power of organization and timely completion of tasks to achieve success.
          </p>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h2 className="h4 mb-3">What We Offer</h2>
          <div className="row">
            <div className="col-md-4 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="h5">Task Management</h3>
                  <p>Create, organize, and track your tasks with ease. Set priorities and deadlines to stay on top of your work.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="h5">Notifications</h3>
                  <p>Stay informed with timely notifications about upcoming tasks and deadlines.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="h5">Progress Tracking</h3>
                  <p>Monitor your progress and maintain a clear overview of completed and pending tasks.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h2 className="h4 mb-3">Our Team</h2>
          <p>
            We are a dedicated team of professionals committed to providing the best task management solution.
            Our expertise in project management and software development allows us to create a tool that truly serves your needs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 