import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ChatBubbleLeftRightIcon, 
  UserCircleIcon,
  VideoCameraIcon,
  PhotoIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';

const IssueTable = ({ issues: rawData }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const currentUserId = user?._id || user?.id || "697f7b415338fe4b865cd176";

  const [issuesList, setIssuesList] = useState([]);
  const [expandedIssue, setExpandedIssue] = useState(null);
  const [visibleCount, setVisibleCount] = useState({});
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const data = Array.isArray(rawData) ? rawData : (rawData?.issues || []);
    setIssuesList(data);
  }, [rawData]);

  const toggleExpand = (id) => {
    setExpandedIssue(expandedIssue === id ? null : id);
    if (expandedIssue !== id) {
      setVisibleCount(prev => ({ ...prev, [id]: 2 }));
    }
  };

  const handlePostComment = async (issueId) => {
    if (!commentText.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await axios.post(`http://localhost:5000/api/issues/comment/${issueId}`, {
        text: commentText
      });
      if (res.data.success) {
        setIssuesList(prev => prev.map(issue => 
          issue._id === issueId ? res.data.issue : issue
        ));
        setCommentText("");
      }
    } catch (err) {
      console.error("Comment failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mt-6 font-sans">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200">
              <th className="px-6 py-4 text-[13px] font-black text-slate-500 uppercase ">Incident Details</th>
              <th className="px-6 py-4 text-[13px] font-black text-slate-500 uppercase ">Status</th>
              <th className="px-6 py-4 text-[13px] font-black text-slate-500 uppercase ">Priority</th>
              <th className="px-6 py-4 text-[13px] font-black text-slate-500 uppercase ">Assignment</th>
              <th className="px-6 py-4 text-[13px] font-black text-slate-500 uppercase  text-right">Engagement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {issuesList.map((issue) => {
              const isExpanded = expandedIssue === issue._id;
              const currentVisible = visibleCount[issue._id] || 2;

              return (
                <React.Fragment key={issue._id}>
                  <tr className={`group transition-colors ${isExpanded ? 'bg-slate-100/50' : 'hover:bg-slate-300/30'}`}>
                    <td className="px-6 py-5">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {issue.media?.endsWith('.mp4') ? <VideoCameraIcon className="w-5 h-5 text-slate-500" /> : <PhotoIcon className="w-5 h-5 text-slate-500" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[17px] font-bold text-slate-800 leading-tight">{issue.title}</span>
                          <span className="text-[13px] text-slate-500 mt-1 line-clamp-1 max-w-[240px] font-medium">{issue.description}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-300 text-white text-[12px] font-bold uppercase ">
                        {issue.status}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span className={`px-3 py-1.5 rounded border text-[12px] font-bold uppercase  ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-2">
                        {/* FIXED: Check if assignment exists */}
                        {issue.assignedTo && issue.assignedTo.length > 0 ? (
                          issue.assignedTo.map((emp) => {
                            const empId = (typeof emp === 'object' ? emp._id : emp)?.toString();
                            const empName = typeof emp === 'object' ? emp.name : "Staff";
                            const isMe = empId === currentUserId?.toString();

                            return (
                              <div key={empId} className={`flex items-center gap-2 px-2 py-1 rounded-md border text-[12px] font-bold transition-all
                                ${isMe ? 'bg-white border-slate-900 text-slate-900 shadow-sm' : 'bg-white border-slate-400 text-slate-600'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${isMe ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                                {isMe ? "ASSIGNED TO ME" : empName.toUpperCase()}
                              </div>
                            );
                          })
                        ) : (
                          /* FIXED: Show message when no one is assigned */
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-dashed border-slate-400 text-slate-600 text-[12px] font-bold">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            NOT ASSIGNED
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => toggleExpand(issue._id)} 
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-[13px] font-bold transition-all
                        ${isExpanded ? 'bg-blue-200 border-blue-400 text-slate-900 shadow-sm' : 'text-blue-400 bg-blue-50 b  border-blue-300 hover:text-blue-600 hover:bg-blue-100 hover:border-blue-300'}`}
                      >
                        <ChatBubbleLeftRightIcon className="  text-blue-500 w-7 h-7" />
                        {issue.comments?.length || 0}
                        {isExpanded ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />}
                      </button>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="bg-slate-50/30">
                      <td colSpan="5" className="px-12 py-8 border-y border-slate-100">
                        <div className="max-w-3xl bg-blue-50 p-8 rounded-2xl">
                          <h4 className="text-[15px] font-black text-slate-600 uppercase mb-6">Internal Activity Log</h4>
                          
                          <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
                            {issue.comments?.slice(0, currentVisible).map((comment) => {
                              const commentUserId = (typeof comment.user === 'object' ? comment.user?._id : comment.user)?.toString();
                              const isCommentMe = commentUserId === currentUserId?.toString();
                              
                              return (
                                <div key={comment._id} className="flex items-start gap-4 relative">
                                  <div className={`z-10 p-1.5 rounded-lg border shadow-sm ${isCommentMe ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-300 text-slate-600'}`}>
                                    <UserCircleIcon className="w-5 h-5" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-[13px] bolder text-slate-800 uppercase">
                                        {isCommentMe ? "You " : "Technical Staff"}
                                      </span>
                                      <span className="text-[10px] text-blue-400 font-bold">
                                        {new Date(comment.createdAt || Date.now()).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <div className={`p-4 rounded-xl text-[16px] leading-relaxed font-bold shadow-sm ${isCommentMe ? 'bg-white border-slate-200 text-slate-900' : 'bg-white/50 border-slate-100 text-slate-900 italic'}`}>
                                      {comment.text}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="mt-8 ml-10">
                            {issue.comments?.length > currentVisible && (
                              <button 
                                onClick={() => setVisibleCount(p => ({...p, [issue._id]: (p[issue._id]||2)+5}))} 
                                className="text-[13px] font-black text-indigo-600 hover:text-indigo-800 uppercase  mb-4"
                              >
                                + View Older Updates
                              </button>
                            )}

                            <div className="flex gap-3 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm focus-within:border-slate-400 transition-all">
                              <input 
                                type="text" 
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Submit a status update..."
                                className="flex-1 px-4 py-2 text-sm outline-none bg-transparent font-medium text-slate-700"
                              />
                              <button 
                                disabled={isSubmitting}
                                onClick={() => handlePostComment(issue._id)} 
                                className="bg-blue-100 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-200 hover:text-blue-600 transition-colors disabled:opacity-50"
                              >
                                <PaperAirplaneIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IssueTable;