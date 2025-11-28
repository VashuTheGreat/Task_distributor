import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <div className="home-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="home-content">
        <div className="hero-section">
          <h1 className="hero-title">
            Collaborate. Organize. <span className="gradient-text">Succeed.</span>
          </h1>
          <p className="hero-subtitle">
            Task Distributor helps teams manage projects, assign tasks, and communicate in real-time.
            All in one beautiful, intuitive platform.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started Free
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg">
              Sign In
            </Link>
          </div>
        </div>

        <div className="features-section">
          <div className="feature-card">
            <div className="feature-icon">🏠</div>
            <h3>Room Management</h3>
            <p>Create and join rooms to organize your projects and teams</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3>Task Tracking</h3>
            <p>Assign tasks, track progress, and stay on top of deadlines</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Real-time Chat</h3>
            <p>Communicate instantly with your team using Socket.io</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
