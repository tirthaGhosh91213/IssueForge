// MakeAdmin.jsx - Full responsive UI like CreateUser page
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FaUser, FaIdBadge, FaEnvelope, FaLock, FaArrowLeft, FaCheckCircle, 
  FaExclamationTriangle, FaSpinner ,FaCrown
} from 'react-icons/fa';

const MakeAdmin = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    empId: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [fetchLoading, setFetchLoading] = useState(true);

  // Fetch existing user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setFetchLoading(true);
        const response = await fetch(`http://localhost:5000/api/admin/users`);
        const data = await response.json();
        if (data.success) {
          const user = data.users?.find(u => u._id === id) || {};
          setFormData({
            name: user.name || '',
            email: user.email || '',
            empId: user.empId || '',
            password: ''
          });
        }
      } catch (err) {
        setError('Failed to fetch user data');
      } finally {
        setFetchLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch(`http://localhost:5000/api/admin/make-admin/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/admin/users');
        }, 2000);
      } else {
        setError(data.message || 'Failed to make user admin');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-4 sm:p-6 lg:p-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 sm:top-8 left-4 sm:left-8 z-50 group px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg sm:rounded-xl backdrop-blur-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium text-sm sm:text-base flex items-center"
      >
        <FaArrowLeft className="mr-1 sm:mr-2 text-sm sm:text-lg group-hover:-translate-x-1 transition-transform" />
        <span className="hidden sm:inline">Back</span>
      </button>

      <div className="max-w-2xl mx-auto pt-20 lg:pt-24">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className=" rounded-3xl mx-auto mb-6 lg:mb-8 flex items-center justify-center shadow-2xl">
            
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 tracking-tight">
            Make Admin
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 font-medium max-w-2xl mx-auto">
            Promote user to admin with full privileges
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-8 animate-slide-down">
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-center text-center">
                <FaCheckCircle className="text-emerald-500 text-4xl sm:text-5xl mr-4 sm:mr-6 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-emerald-800 mb-2">Admin Created Successfully!</h3>
                  <p className="text-lg text-emerald-700">Redirecting to users list...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && !success && (
          <div className="mb-8 animate-slide-down">
            <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center">
                <FaExclamationTriangle className="text-red-500 text-3xl sm:text-4xl mr-4 sm:mr-6 flex-shrink-0" />
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-red-800 mb-2">{error}</h3>
                  <button
                    onClick={() => setError('')}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="backdrop-blur-xl bg-white/90 border border-gray-200/50 shadow-2xl rounded-3xl p-6 sm:p-8 lg:p-10 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-3 flex items-center">
                <FaUser className="mr-2 text-indigo-500" />
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 sm:px-6 py-4 sm:py-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-lg placeholder-gray-400 shadow-lg hover:shadow-xl"
                  placeholder="Enter full name"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-3 flex items-center">
                <FaEnvelope className="mr-2 text-emerald-500" />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 sm:px-6 py-4 sm:py-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-lg placeholder-gray-400 shadow-lg hover:shadow-xl"
                  placeholder="Enter email address"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Employee ID Field */}
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-3 flex items-center">
                <FaIdBadge className="mr-2 text-purple-500" />
                Employee ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="empId"
                  value={formData.empId}
                  onChange={handleChange}
                  className="w-full px-4 sm:px-6 py-4 sm:py-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-lg placeholder-gray-400 shadow-lg hover:shadow-xl font-mono"
                  placeholder="EMP001"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-3 flex items-center">
                <FaLock className="mr-2 text-orange-500" />
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 sm:px-6 py-4 sm:py-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-lg placeholder-gray-400 shadow-lg hover:shadow-xl"
                  placeholder="Enter new password"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black py-5 px-8 rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all duration-300 text-lg sm:text-xl flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin text-xl" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <FaCrown className="text-2xl group-hover:rotate-12 transition-transform duration-300" />
                  <span>Make Admin</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .animate-slide-up {
          animation: slideUp 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .animate-slide-down {
          animation: slideDown 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MakeAdmin;
