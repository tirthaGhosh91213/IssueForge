import React from 'react';
import { 
  ExclamationCircleIcon, 
  CheckCircleIcon, 
  ClockIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const IssueTable = ({ issues }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header Section */}
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Project Issues</h2>
          <p className="text-sm text-slate-500 font-medium">Tracking lifecycle of reported bugs and improvements</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">
            {issues.length} Active Records
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        {issues.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] border-b border-slate-50">
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Summary</th>
                <th className="px-8 py-5">Priority</th>
                <th className="px-8 py-5 text-right">Filed On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {issues.map((issue) => (
                <tr key={issue._id} className="group hover:bg-slate-50/50 transition-colors cursor-default">
                  <td className="px-8 py-5">
                    {issue.status === 'Resolved' ? (
                      <div className="flex items-center gap-2 text-emerald-600">
                        <CheckCircleIcon className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-wider">Resolved</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-amber-500">
                        <ClockIcon className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-wider">Pending</span>
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <div className="max-w-md">
                      <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {issue.title}
                      </p>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {issue.description}
                      </p>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border ${
                      issue.priority === 'High' 
                        ? 'bg-red-50 text-red-600 border-red-100' 
                        : 'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {issue.priority}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className="text-xs font-bold text-slate-400">
                      {new Date(issue.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <ExclamationCircleIcon className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Zero Issues Found</h3>
            <p className="text-slate-400 text-sm max-w-[250px] mt-1">
              Everything looks good. No issues have been reported for this specific project.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueTable;