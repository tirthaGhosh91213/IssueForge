import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UsersIcon, 
  EnvelopeIcon,  // ✅ Fixed: was MailIcon
  UserIcon,
  ArrowLeftIcon,
  EyeIcon,
  // CrownIcon doesn't exist - using UserIcon for admin
  // CheckCircleIcon doesn't exist - using EyeIcon for details  
  TrashIcon
} from '@heroicons/react/24/outline';

const UsersList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
      setError('Network error. Please try again.');
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

  // Make admin
  const handleMakeAdmin = useCallback((userId) => {
    navigate(`/admin/make-admin/${userId}`);
  }, [navigate]);

  // View details
  const handleViewDetails = useCallback((userId) => {
    navigate(`/admin/user-details/${userId}`);
  }, [navigate]);

  // Filter users
  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                Back
              </button>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-indigo-700 rounded-lg flex items-center justify-center shadow-lg">
                  <UsersIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">All Users</h1>
                  <p className="text-gray-600">Manage your team members</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mt-8 max-w-md">
            <div className="relative">
              <EnvelopeIcon className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <TrashIcon className="h-6 w-6 text-red-400 mt-0.5" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={fetchUsers}
                  className="inline-flex px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4" />
                      Name
                    </div>
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <EnvelopeIcon className="h-4 w-4" />
                      Email
                    </div>
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                    Employee ID
                  </th>
                  <th className="px-6 py-5  text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <UsersIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {searchTerm ? 'No matching users found' : 'No users found'}
                        </h3>
                        <p className="text-sm">Try adjusting your search or create a new user.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-indigo-800 font-semibold text-lg">
                              {user.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{user.name || 'N/A'}</div>
                            <div className="text-sm text-gray-500">{user.role || 'User'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 max-w-md">
                        <div className="text-sm text-gray-900 truncate">{user.email || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-6 hidden md:table-cell">
                        <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-mono font-semibold text-gray-800">
                          {user.empId || user._id?.slice(-6) || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap space-x-2">
                        <button
                          onClick={() => handleViewDetails(user._id)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          Details
                        </button>
                        <button
                          onClick={() => handleMakeAdmin(user._id)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-lg shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                        >
                          <UserIcon className="h-4 w-4 mr-1" />
                          Admin
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          disabled={deletingId === user._id}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-lg shadow-sm text-gray-500 bg-gray-100 hover:bg-red-200 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                        >
                          {deletingId === user._id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                              Delete
                            </>
                          ) : (
                            <>
                              <TrashIcon className="h-4 w-4 mr-1" />
                              Delete
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersList;
