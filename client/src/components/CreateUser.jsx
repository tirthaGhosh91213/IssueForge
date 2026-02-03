// CreateUser.jsx
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    empId: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.empId.trim()) newErrors.empId = 'Employee ID is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.success) {
        setSuccess(data.user || data);
      } else {
        alert('Error: ' + (data.message || 'Failed to create user'));
      }
    } catch (error) {
      alert('Network error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm]);

  const resetForm = useCallback(() => {
    setFormData({ name: '', email: '', empId: '', password: '' });
    setSuccess(null);
    setErrors({});
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 flex items-center justify-center p-6 relative">
      {/* Back Button - Fixed Left Side */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-8 left-8 z-50 group px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl backdrop-blur-xl border border-indigo-200/50 hover:border-indigo-300/70 font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
      >
        <i className="fas fa-arrow-left mr-2 text-lg group-hover:-translate-x-1 transition-transform"></i>
        Back
      </button>

      <div className="w-full max-w-md mx-auto">
        {/* Main Card */}
        {!success ? (
          <div className="backdrop-blur-xl bg-white/95 border border-gray-200/50 shadow-2xl rounded-3xl p-8">
            <div className="text-center mb-8">
              <div className=" mx-auto mb-6 flex items-center justify-center shadow-lg">
                <i className="fas fa-user-plus text-3xl text-white"></i>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-3">
                New User
              </h1>
              <p className="text-gray-600 text-lg font-medium">Create a new team member account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 flex items-center">
                  <i className="fas fa-user mr-2 text-indigo-500 text-sm"></i>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className={`w-full px-5 py-4 text-lg rounded-2xl backdrop-blur-sm border-2 border-gray-200 focus:border-indigo-400/70 focus:ring-4 focus:ring-indigo-200/50 transition-all duration-300 shadow-sm ${
                    errors.name ? 'border-red-300 bg-red-50/80 ring-2 ring-red-200/50' : 'hover:border-indigo-200 hover:bg-gray-50/50'
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm flex items-center bg-red-50 px-3 py-2 rounded-xl border border-red-200">
                    <i className="fas fa-exclamation-circle mr-2"></i>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 flex items-center">
                  <i className="fas fa-envelope mr-2 text-purple-500 text-sm"></i>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className={`w-full px-5 py-4 text-lg rounded-2xl backdrop-blur-sm border-2 border-gray-200 focus:border-purple-400/70 focus:ring-4 focus:ring-purple-200/50 transition-all duration-300 shadow-sm ${
                    errors.email ? 'border-red-300 bg-red-50/80 ring-2 ring-red-200/50' : 'hover:border-purple-200 hover:bg-gray-50/50'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm flex items-center bg-red-50 px-3 py-2 rounded-xl border border-red-200">
                    <i className="fas fa-exclamation-circle mr-2"></i>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Employee ID Field */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 flex items-center">
                  <i className="fas fa-id-badge mr-2 text-pink-500 text-sm"></i>
                  Employee ID
                </label>
                <input
                  type="text"
                  name="empId"
                  value={formData.empId}
                  onChange={handleInputChange}
                  placeholder="EMP301"
                  className={`w-full px-5 py-4 text-lg rounded-2xl backdrop-blur-sm border-2 border-gray-200 focus:border-pink-400/70 focus:ring-4 focus:ring-pink-200/50 transition-all duration-300 shadow-sm ${
                    errors.empId ? 'border-red-300 bg-red-50/80 ring-2 ring-red-200/50' : 'hover:border-pink-200 hover:bg-gray-50/50'
                  }`}
                />
                {errors.empId && (
                  <p className="text-red-500 text-sm flex items-center bg-red-50 px-3 py-2 rounded-xl border border-red-200">
                    <i className="fas fa-exclamation-circle mr-2"></i>
                    {errors.empId}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 flex items-center">
                  <i className="fas fa-lock mr-2 text-gray-500 text-sm"></i>
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••"
                  className={`w-full px-5 py-4 text-lg rounded-2xl backdrop-blur-sm border-2 border-gray-200 focus:border-gray-400/70 focus:ring-4 focus:ring-gray-200/50 transition-all duration-300 shadow-sm ${
                    errors.password ? 'border-red-300 bg-red-50/80 ring-2 ring-red-200/50' : 'hover:border-gray-200 hover:bg-gray-50/50'
                  }`}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm flex items-center bg-red-50 px-3 py-2 rounded-xl border border-red-200">
                    <i className="fas fa-exclamation-circle mr-2"></i>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-5 px-6 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 flex items-center justify-center space-x-3 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed opacity-60'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] text-white'
                }`}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus"></i>
                    <span>Create User</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Success Screen */
          <div className="backdrop-blur-xl bg-white/95 border border-gray-200/50 shadow-2xl rounded-3xl p-8">
            <div className="text-center mb-8">
              <div className=" mx-auto mb-6 flex items-center justify-center shadow-xl">
                <i className="fas fa-check text-4xl text-white"></i>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Success!
              </h2>
              <p className="text-gray-700 text-lg font-semibold">User created successfully</p>
            </div>

            <div className="space-y-4 mb-8 p-6 bg-gray-50/80 rounded-2xl border border-gray-200">
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div><span className="font-semibold text-gray-700">Name:</span> {success.name}</div>
                <div><span className="font-semibold text-gray-700">Email:</span> {success.email}</div>
                <div><span className="font-semibold text-gray-700">Employee ID:</span> {success.empId}</div>
                <div><span className="font-semibold text-gray-700">Created:</span> {success.createdAt ? new Date(success.createdAt).toLocaleString() : 'Just now'}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={resetForm}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <i className="fas fa-plus"></i>
                <span>New User</span>
              </button>
              <button
                onClick={() => navigate(-1)}
                className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-200 flex items-center justify-center space-x-2"
              >
                <i className="fas fa-home"></i>
                <span>Dashboard</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateUser;
