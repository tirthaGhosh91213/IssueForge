// UsersList.jsx - FULLY RESPONSIVE + React Icons
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaIdBadge, FaEnvelope, FaUsers, FaCrown, FaTrash, FaPlus, FaSyncAlt, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';

const UsersList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/admin/users');
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users || data);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete user
  const handleDelete = useCallback(async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      setDeletingId(userId);
      const response = await fetch(`http://localhost:5000/api/admin/user/${userId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (data.success) {
        setUsers(prev => prev.filter(user => user._id !== userId));
      } else {
        alert('Error: ' + (data.message || 'Failed to delete user'));
      }
    } catch (err) {
      alert('Network error: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  }, []);

  // Make admin (navigate to path)
  const handleMakeAdmin = useCallback((userId) => {
    navigate(`/admin/make-admin/${userId}`);
  }, [navigate]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg sm:text-xl font-semibold text-gray-700">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-4 sm:p-6 lg:p-8">
      {/* Back Button - Responsive */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 sm:top-8 left-4 sm:left-8 z-50 group px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg sm:rounded-xl backdrop-blur-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium text-sm sm:text-base flex items-center"
      >
        <FaArrowLeft className="mr-1 sm:mr-2 text-sm sm:text-lg group-hover:-translate-x-1 transition-transform" />
        <span className="hidden sm:inline">Back</span>
      </button>

      <div className="max-w-6xl mx-auto pt-16 sm:pt-20 lg:pt-24">
        {/* Header - Responsive */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 animate-fade-in">
          <div className=" rounded-2xl lg:rounded-3xl mx-auto mb-4 sm:mb-6 flex items-center justify-center shadow-2xl">
            
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2 sm:mb-4 lg:mb-5 tracking-tight">
            User Management
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 font-medium max-w-2xl mx-auto px-4">
            Manage your team members with full control
          </p>
        </div>

        {/* Error Alert - Responsive */}
        {error && (
          <div className="max-w-4xl mx-auto mb-6 sm:mb-8 animate-slide-down">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <FaExclamationTriangle className="text-red-500 text-xl sm:text-2xl flex-shrink-0 mt-1 sm:mt-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-base sm:text-lg font-semibold text-red-800 mb-2 sm:mb-0">{error}</p>
                  <button
                    onClick={fetchUsers}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 mt-2 sm:mt-0"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Table Card - FULLY RESPONSIVE */}
        <div className="backdrop-blur-xl bg-white/90 border border-gray-200/50 shadow-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 animate-slide-up max-w-4xl lg:max-w-6xl mx-auto">
          <div className="overflow-hidden rounded-2xl">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] lg:min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b-2 border-indigo-100">
                    <th className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 text-left text-sm sm:text-lg lg:text-xl font-bold text-gray-800 uppercase tracking-wider">
                      <FaUser className="inline mr-1 sm:mr-2 text-indigo-600 text-sm sm:text-base lg:text-lg" />
                      User Info
                    </th>
                    <th className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 text-left text-sm sm:text-lg lg:text-xl font-bold text-gray-800 uppercase tracking-wider hidden md:table-cell">
                      <FaIdBadge className="inline mr-1 sm:mr-2 text-purple-600 text-sm sm:text-base lg:text-lg" />
                      Employee ID
                    </th>
                    <th className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 text-left text-sm sm:text-lg lg:text-xl font-bold text-gray-800 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 text-right text-sm sm:text-lg lg:text-xl font-bold text-gray-800 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user, index) => (
                    <tr 
                      key={user._id || index}
                      className="hover:bg-gray-50/50 group transition-all duration-300 hover:shadow-md animate-slide-up-stagger border-b border-gray-100 last:border-b-0"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          {/* User Icon LEFT of name - React Icons */}
                          <FaUser className="text-xl sm:text-2xl lg:text-3xl text-indigo-500 shadow-lg hover:scale-110 transition-transform duration-200 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors truncate">
                              {user.name || 'N/A'}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500 mt-0.5">
                              {user.role || 'User'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 hidden md:table-cell">
                        <div className="bg-indigo-100 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg lg:rounded-xl font-mono font-semibold text-indigo-800 text-sm sm:text-base lg:text-lg">
                          {user.empId || 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                        <div className="text-gray-900 font-medium text-sm sm:text-base truncate max-w-xs lg:max-w-md">
                          {user.email || 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 text-right space-x-1 sm:space-x-2 lg:space-x-3">
                        <button
                          onClick={() => handleMakeAdmin(user._id)}
                          className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-xs sm:text-sm lg:text-base flex-shrink-0"
                          title="Make Admin"
                        >
                          <FaCrown className="mr-1 text-xs sm:text-sm lg:text-base" />
                          <span className="hidden sm:inline lg:inline">Admin</span>
                          <span className="sm:hidden">👑</span>
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          disabled={deletingId === user._id}
                          className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-xs sm:text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex-shrink-0"
                          title="Delete User"
                        >
                          {deletingId === user._id ? (
                            <>
                              <FaSyncAlt className="animate-spin mr-1 text-xs sm:text-sm lg:text-base" />
                              <span className="hidden sm:inline">Deleting...</span>
                            </>
                          ) : (
                            <>
                              <FaTrash className="mr-1 text-xs sm:text-sm lg:text-base" />
                              <span className="hidden sm:inline">Delete</span>
                              <span className="sm:hidden">🗑️</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State - Responsive */}
            {users.length === 0 && !loading && (
              <div className="text-center py-12 sm:py-16 lg:py-20 animate-fade-in">
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-24 lg:h-24 bg-gray-100 rounded-2xl lg:rounded-3xl mx-auto mb-6 sm:mb-8 flex items-center justify-center">
                  <FaUsers className="text-2xl sm:text-3xl lg:text-4xl text-gray-400" />
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-2xl font-bold text-gray-700 mb-2 sm:mb-4">No users found</h3>
                <p className="text-gray-500 text-base sm:text-lg mb-6 sm:mb-8 px-4">Get started by creating your first user</p>
                <button
                  onClick={() => navigate('/admin/create-user')}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-sm sm:text-base flex items-center mx-auto"
                >
                  <FaPlus className="mr-2" />
                  Create User
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Refresh Button - Responsive */}
        <div className="text-center mt-8 sm:mt-12 animate-fade-in">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-slate-500 to-gray-600 hover:from-slate-600 hover:to-gray-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base flex items-center mx-auto"
          >
            <FaSyncAlt className="mr-2" />
            Refresh List
          </button>
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
        @keyframes slideUpStagger {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .animate-slide-up {
          animation: slideUp 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .animate-slide-up-stagger {
          animation: slideUpStagger 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .animate-slide-down {
          animation: slideDown 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UsersList;
