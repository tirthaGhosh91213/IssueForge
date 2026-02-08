import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  BriefcaseIcon, 
  CalendarIcon, 
  UserCircleIcon,
  ArrowTopRightOnSquareIcon,
  ChevronLeftIcon 
} from '@heroicons/react/24/outline';

export default function MyTasks() {
  const [data, setData] = useState({ user: {}, issues: [], totalIssues: 0 });
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);

  // 1. Get ID from URL
  const { userId: urlUserId } = useParams(); 
  
  // 2. Fallback: If no ID in URL, get from localStorage (common for logged-in users)
  const activeUserId = urlUserId || localStorage.getItem('userId') || "697f7b415338fe4b865cd176"; 

  useEffect(() => {
    const fetchTasks = async () => {
      // If we still have no ID, show an error instead of crashing
      if (!activeUserId) {
        setError("No User ID found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/issues/assigned/user/${activeUserId}`);
        if (res.data.success) {
          setData(res.data);
          setError(null);
        }
      } catch (err) {
        console.error("Task fetch failed", err);
        setError("Could not load tasks. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [activeUserId]);

  const handleStatusChange = async (issueId, newStatus) => {
    setUpdatingId(issueId);
    try {
      const res = await axios.put(`http://localhost:5000/api/issues/status/${issueId}`, {
        status: newStatus
      });
      
      if (res.data.success) {
        setData(prev => ({
          ...prev,
          issues: prev.issues.map(issue => 
            issue._id === issueId ? { ...issue, status: newStatus } : issue
          )
        }));
      }
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'medium': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500">
      <p className="mb-4">{error}</p>
      <button onClick={() => window.location.reload()} className="text-blue-600 font-bold underline">Retry</button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 font-sans text-slate-900">
      <button 
        onClick={() => window.history.back()} 
        className="flex items-center gap-2 mb-6 text-slate-500 hover:text-blue-600 transition-colors group"
        style={{ fontSize: '13px' }}
      >
        <ChevronLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span className="font-semibold">Back to Dashboard</span>
      </button>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
            <span className="text-[14px] font-black uppercase tracking-[0.1em] text-slate-400">Assignment  Portal</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, <span className="text-blue-600">{data.user?.name || 'User'}</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            You have <span className="text-blue-600 font-bold">{data.totalIssues} active assignments</span>.
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white border border-slate-200 rounded-xl px-5 py-3 shadow-sm">
            <div className="text-[13px] font-bold text-slate-400 uppercase">Internal Email</div>
            <div className="text-[15px] font-bold text-slate-700">{data.user?.email}</div>
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-2xl shadow-[0_12px_40px_-15px_rgba(0,0,0,0.03)] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-400">
                <th className="px-8 py-5 text-[13px] font-black text-slate-600 uppercase ">Project & Issue</th>
                <th className="px-6 py-5 text-[13px] font-black text-slate-600 uppercase ">Priority</th>
                <th className="px-6 py-5 text-[13px] font-black text-slate-600 uppercase ">Status</th>
                <th className="px-6 py-5 text-[13px] font-black text-slate-600 uppercase ">Assigned By</th>
                <th className="px-8 py-5 text-[13px] font-black text-slate-600 uppercase  text-right">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.issues.map((issue) => (
                <tr key={issue._id} className="group hover:bg-blue-50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <BriefcaseIcon className="w-5 h-5 text-blue-600" />
                        <span className="text-[15px] font-bold text-blue-600 uppercase ">
                          {issue.project?.name}
                        </span>
                      </div>
                      <span className="text-[14px] pl-8 pt-2.5 font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {issue.title}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-6">
                    <span className={`px-2.5 py-1 rounded-md border text-[13px] font-bold uppercase  ${getPriorityStyle(issue.priority)}`}>
                      {issue.priority}
                    </span>
                  </td>

                  <td className="px-6 py-6 ">
                    <div className="flex items-center gap-1 ">
                      <div className={`w-1.5 h-1.5 rounded-full ${issue.status === 'fixed' ? 'bg-emerald-500' : 'bg-amber-400'} ${updatingId === issue._id ? 'animate-ping' : ''}`}></div>
                      <select 
                        className="text-[15px] font-bold text-slate-700 bg-transparent border-slate-300 rounded-3xl p-4 focus:ring-0 cursor-pointer outline-none"
                        value={issue.status}
                        disabled={updatingId === issue._id}
                        onChange={(e) => handleStatusChange(issue._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="working">Working</option>
                        <option value="fixed">Fixed</option>
                      </select>
                    </div>
                  </td>

                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 text-slate-900 mb-1">
                        <UserCircleIcon className="w-5 h-5 text-slate-400" />
                        <span className="text-[15px] font-bold">Manager</span>
                      </div>
                      <span className="text-[13px] text-slate-400 font-medium ml-6">{issue.assignedBy?.email}</span>
                    </div>
                  </td>

                  <td className="px-8 py-6 text-right">
                    <div className="flex flex-col items-end gap-2 text-slate-500">
                       <CalendarIcon className="w-5 h-5" />
                       <span className="text-[14px] font-bold">
                        {new Date(issue.assignedAt).toLocaleDateString()}
                       </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}