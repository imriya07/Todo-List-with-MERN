import React, { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import 'react-toastify/dist/ReactToastify.css';
import '../index.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.warn('Please enter a valid email address.');
      return false;
    }

    if (password.length < 6) {
      toast.warn('Password should be at least 6 characters long.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.post('https://backend-theta-plum-15.vercel.app/api/auth/login', {
        email,
        password,
      });

      if (response.status === 200 || response.data.success) {
        const token = response.data.token;
        localStorage.setItem('authToken', token);
        toast.success('Login successful!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="login-background d-flex justify-content-center align-items-center min-vh-100 mt-5">
      <Container className="d-flex justify-content-center">
        <div className="custom-form-container p-4 rounded shadow" style={{ maxWidth: '400px', width: '100%' }}>
          <h3 className="text-center login-text">Login</h3>
          <p className='plaeseregister text-center'>Welcome back! Please enter your credentials.</p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              className="form-control mb-3 placeholder-custom"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="password-container position-relative">
              <input
                type={passwordVisible ? 'text' : 'password'}
                className="form-control mb-3 placeholder-custom"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div
                className="password-toggle-icon position-absolute"
                style={{
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: 'black' 
                }}
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            <Button type="submit" className="w-100 login-btn">
              Login
            </Button>
          </form>
        </div>
      </Container>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Login;
