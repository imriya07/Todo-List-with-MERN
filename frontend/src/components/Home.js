import React from 'react';
import '../index.css'; 

const Home = () => {
  return (
    <div className="login-background d-flex justify-content-center align-items-center vh-100">
      <div className="home-card text-center text-white p-4 rounded">
        <h1 className="mb-3 welcome">Your Journey to Productivity Starts Here</h1>
        <p className="mb-0 welcometext">Manage your tasks efficiently and effectively!</p>
      </div>
    </div>
  );
};

export default Home;
