import React, { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import 'react-toastify/dist/ReactToastify.css';
import '../index.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); 
  const navigate = useNavigate();

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name.trim().length < 3) {
      toast.warn('Name should be at least 3 characters long.');
      return false;
    }

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
      const response = await axios.post('https://todo-lake-delta.vercel.app/api/auth/register', {
        name,
        email,
        password,
      });
  
      if (response.status === 201 || response.data.success) {
        toast.success('Registration successful!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error('User is already registered. Please go to the login page.');
      } else {
        console.error('Registration failed:', error);
        toast.error('Something went wrong. Try again!');
      }
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
          <h3 className="text-center register-text">Register</h3>
          <p className='text-center plaeseregister'>Please register to access exclusive features.</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="form-control mb-3 placeholder-custom"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
                  color: 'black', 
                }}
                onClick={() => setPasswordVisible(!passwordVisible)} 
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />} 
              </div>
            </div>
            <Button type="submit" className="w-100 register-btn">
              Register
            </Button>
          </form>
        </div>
      </Container>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Register;
