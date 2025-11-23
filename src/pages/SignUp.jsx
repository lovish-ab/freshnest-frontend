import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
import apiClient from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    // Full Name validation
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (formData.fullName.trim().length < 2) {
      setError('Full name must be at least 2 characters long');
      return false;
    }
    // Check for numbers in name
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    if (!nameRegex.test(formData.fullName.trim())) {
      setError('Full name should only contain letters, spaces, hyphens, and apostrophes');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address');
      return false;
    }

    // Phone Number validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phoneNumber.trim()) {
      setError('Phone number is required');
      return false;
    }
    const cleanedPhone = formData.phoneNumber.replace(/\s+/g, '');
    if (!phoneRegex.test(cleanedPhone)) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }

    // Password validation
    if (!formData.password.trim()) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const cleanedPhone = formData.phoneNumber.replace(/\s+/g, '');
      const response = await apiClient.post('/api/auth/signup', {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phoneNumber: cleanedPhone,
        password: formData.password
      });
      login(response.data.token, response.data.user);
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.error || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Sign Up</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={(e) => {
                  const value = e.target.value.replace(/[0-9]/g, '');
                  setFormData({ ...formData, fullName: value });
                }}
                required
                minLength={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onBlur={(e) => {
                  if (e.target.value && !e.target.value.trim()) {
                    setError('Full name cannot be empty');
                  }
                }}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onBlur={(e) => {
                  if (e.target.value && !e.target.value.trim()) {
                    setError('Email cannot be empty');
                  }
                }}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                maxLength={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                }}
                onBlur={(e) => {
                  const cleaned = e.target.value.replace(/\s+/g, '');
                  if (e.target.value && cleaned.length !== 10) {
                    setError('Phone number must be exactly 10 digits');
                  }
                }}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onBlur={(e) => {
                  if (e.target.value && e.target.value.length < 8) {
                    setError('Password must be at least 8 characters long');
                  }
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50"
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/signin" className="text-blue-500 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;