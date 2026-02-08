import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  UserIcon, 
  EnvelopeIcon, 
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ClockIcon as PendingIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const UserDetailsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/issues/assigned/user/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setUserData(data);
      } else {
        setError('Failed to fetch user details');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Format date to DD MMM YYYY, HH:mm format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center p-8">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{error || 'User not found'}</h2>
          <button 
            onClick={fetchUserDetails}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { user, totalIssues, issues } = userData;
  const statusCounts = issues.reduce((acc, issue) => {
    acc[issue.status] = (acc[issue.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-12">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Back Button + User Info */}
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-x-0.5"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                Back
              </button>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <UserIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                  <p className="text-slate-600 flex items-center gap-2">
                    <EnvelopeIcon className="h-5 w-5" />
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg font-medium">
              {totalIssues} Total Issues
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8 lg:grid lg:grid-cols-3">
        {/* Stats Cards */}
        <div className="lg:col-span-1 space-y-6 mb-8 lg:mb-0">
          {/* Status Overview */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <DocumentTextIcon className="h-6 w-6 text-indigo-600" />
              Issue Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Fixed</p>
                    <p className="text-sm text-slate-600">{statusCounts.fixed || 0}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl border border-orange-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <PendingIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Pending</p>
                    <p className="text-sm text-slate-600">{statusCounts.pending || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Priority Overview */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              Priority Distribution
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-red-600 font-medium">High Priority</span>
                <span className="font-semibold text-gray-900">{issues.filter(i => i.priority === 'high').length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Issues Table */}
        <div className="lg:col-span-2 w-max">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                Assigned Issues
                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                  {totalIssues}
                </span>
              </h2>
            </div>
            
            <div className="">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider hidden md:table-cell">
                      Priority
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Assigned Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider hidden lg:table-cell">
                      Assigned By
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {issues.map((issue) => (
                    <tr key={issue._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-6 font-medium text-gray-900 whitespace-nowrap">
                        {issue.title}
                      </td>
                      <td className="px-6 py-6">
                        <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                          {issue.project.name}
                        </span>
                      </td>
                      <td className="px-6 py-6 hidden md:table-cell">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          issue.priority === 'high' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {issue.priority}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-sm font-medium text-slate-900">
                        {formatDate(issue.assignedAt)}
                      </td>
                      <td className="px-6 py-6 hidden lg:table-cell">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-900">
                            {issue.assignedBy.email.split('@')[0]}
                          </p>
                          <p className="text-xs text-slate-500">
                            ID: {issue.assignedBy._id.slice(-6)}
                          </p>
                          <div className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md truncate max-w-[140px]">
                            {issue.assignedBy.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          issue.status === 'fixed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {issue.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {issues.length === 0 && (
              <div className="text-center py-16">
                <DocumentTextIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No issues assigned</h3>
                <p className="text-slate-600 mb-6">This user currently has no assigned issues.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;
