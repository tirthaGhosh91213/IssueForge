import { motion } from "framer-motion";
import { 
  Search, 
  Users, 
  Pencil, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Image as ImageIcon, 
  User  // ✅ MISSING IMPORT FIXED
} from "lucide-react";

export default function IssuesSection({ 
  filteredIssues, 
  search, 
  onSearchChange, 
  onAssignClick, 
  onEditIssue, 
  onDeleteIssue 
}) {
  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-8 py-8 lg:px-12 lg:py-12">
        {/* Header + Search */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-10 gap-6">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Project Issues ({filteredIssues.length})</h2>
            <p className="text-sm text-gray-500 mt-1">Manage tasks and track progress</p>
          </div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              placeholder="Search issues by title or description..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            />
          </div>
        </div>

        {/* Issues List */}
        <div className="space-y-6">
          {filteredIssues.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
              <Search className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No issues found</h3>
              <p className="text-gray-500 text-lg">Try adjusting your search or create a new issue</p>
            </div>
          ) : (
            filteredIssues.map((issue, index) => (
              <IssueCard
                key={issue._id}
                issue={issue}
                index={index}
                onEdit={onEditIssue}
                onDelete={onDeleteIssue}
                onAssign={() => onAssignClick({ open: true, issueId: issue._id, employeeSearch: "", selectedEmployees: new Set() })}
              />
            ))
          )}
        </div>
      </div>
    </motion.section>
  );
}

// ✅ NEW: IssueCard Sub-component (handles User icon)
function IssueCard({ issue, index, onEdit, onDelete, onAssign }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group border border-gray-200 rounded-2xl p-8 hover:shadow-lg hover:border-gray-300 transition-all duration-300 overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 items-start lg:items-center gap-8 lg:gap-6">
        {/* ISSUE DETAILS */}
        <div className="lg:col-span-6 space-y-4">
          <div>
            <h4 className="text-2xl font-bold text-gray-900 leading-tight group-hover:text-indigo-900 transition-colors">
              {issue.title}
            </h4>
            <p className="text-gray-600 mt-2 leading-relaxed text-lg">
              {issue.description || 'No description available'}
            </p>
          </div>

          {/* ✅ FIXED: WORKING EMPLOYEE DISPLAY */}
          {issue.assignedTo && issue.assignedTo.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-3">
              {issue.assignedTo.map(emp => (
                <div
                  key={emp._id}
                  className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-lg"
                >
                  <User className="w-4 h-4" /> {/* ✅ NOW WORKS */}
                  <span className="text-sm font-medium">{emp.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No employee assigned</p>
              <p className="text-sm text-gray-400">Click "Assign Team" to add members</p>
            </div>
          )}
        </div>

        {/* STATUS & PRIORITY */}
        <div className="lg:col-span-2 flex flex-col gap-6 justify-center lg:justify-start">
          <PriorityBadge priority={issue.priority} />
          <StatusBadge status={issue.status} />
        </div>

        {/* ACTIONS */}
        <div className="lg:col-span-2 flex flex-wrap gap-3 justify-center lg:justify-end order-3 lg:order-2">
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => onEdit(issue._id)} className="px-5 py-2.5 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all duration-200">
            <Pencil className="w-4 h-4 inline mr-2" /> Edit
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => onDelete(issue._id)} className="px-5 py-2.5 border border-red-300 text-sm font-medium rounded-xl text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm transition-all duration-200">
            <Trash2 className="w-4 h-4 inline mr-2" /> Delete
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} onClick={onAssign} className="inline-flex items-center px-5 py-2.5 border border-indigo-300 text-sm font-semibold rounded-xl text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all duration-200">
            <Users className="w-4 h-4 mr-2" /> Assign Team
          </motion.button>
        </div>

        {/* MEDIA */}
        <MediaPreview media={issue.media} />
      </div>
    </motion.div>
  );
}

// ✅ Helper Components
function PriorityBadge({ priority }) {
  const colors = {
    low: 'bg-green-50 border-green-200 text-green-800',
    medium: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    high: 'bg-red-50 border-red-200 text-red-800'
  };
  
  return (
    <div className="flex flex-col items-center lg:items-start gap-2">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Priority</span>
      <span className={`px-4 py-2 rounded-lg text-sm font-bold border-2 shadow-sm ${colors[priority] || 'bg-gray-50 border-gray-200 text-gray-800'}`}>
        {priority?.toUpperCase()}
      </span>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <div className="flex flex-col items-center lg:items-start gap-2">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</span>
      <span className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 border-2 shadow-sm ${
        status === 'done' || status === 'fixed' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
        status === 'progress' ? 'bg-blue-50 border-blue-200 text-blue-800' :
        'bg-gray-50 border-gray-200 text-gray-800'
      }`}>
        {status === 'done' || status === 'fixed' ? <CheckCircle className="w-4 h-4" /> : null}
        {status === 'progress' && <Clock className="w-4 h-4" />}
        {status === 'pending' && <AlertTriangle className="w-4 h-4" />}
        <span className="capitalize">{status}</span>
      </span>
    </div>
  );
}

function MediaPreview({ media }) {
  if (!media) {
    return (
      <div className="lg:col-span-2 flex justify-end order-last">
        <div className="relative w-44 h-32 lg:w-52 lg:h-36">
          <div className="w-full h-full bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 flex justify-end order-last">
      <div className="relative w-44 h-32 lg:w-52 lg:h-36">
        {media.toLowerCase().endsWith('.mp4') ? (
          <video 
            src={`http://localhost:5000/uploads/${media}`} 
            className="w-full h-full object-cover rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300" 
            controls 
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <img 
            src={`http://localhost:5000/uploads/${media}`} 
            className="w-full h-full object-cover rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer" 
            alt="Issue media" 
          />
        )}
      </div>
    </div>
  );
}
