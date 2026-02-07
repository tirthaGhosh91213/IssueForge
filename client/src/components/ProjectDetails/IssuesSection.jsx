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
  User,
  Loader2,
  X,
  Check
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

export default function IssuesSection({ 
  filteredIssues, 
  search, 
  onSearchChange, 
  onAssignClick, 
  onEditIssue, 
  onDeleteIssue,
  refreshIssues
}) {
  // State management
  const [singleAssignModal, setSingleAssignModal] = useState({ open: false, issueId: null });
  const [successPopup, setSuccessPopup] = useState({ open: false, message: '', employeeName: '' });
  const [assigningIssues, setAssigningIssues] = useState(new Set());
  const [removingEmployees, setRemovingEmployees] = useState(new Set());
  const [employees, setEmployees] = useState([]);
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  // ✅ DYNAMIC ADMIN ID
  const [adminId, setAdminId] = useState("");

  useEffect(() => {
    const storedId = localStorage.getItem("adminId") || "697f7455a657114b9d853f92";
    setAdminId(storedId);
  }, []);

  // ✅ FIXED: Fetch employees with current issue's assigned employees tracking
  const fetchEmployees = async (currentIssueId = null) => {
    setLoadingEmployees(true);
    try {
      const response = await fetch('http://localhost:5000/api/admin/users');
      const data = await response.json();
      if (data.success) {
        setEmployees(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoadingEmployees(false);
    }
  };

  // ✅ INTERNAL REFRESH TRIGGER
  const triggerRefresh = useCallback(async () => {
    if (refreshIssues && typeof refreshIssues === 'function') {
      console.log("🔄 Triggering auto-refresh...");
      await refreshIssues(); 
    } else {
      console.error("❌ Refresh failed: refreshIssues prop is missing or not a function.");
    }
  }, [refreshIssues]);

  // ✅ FIXED: Filter out already assigned employees
  const getAvailableEmployeesForIssue = (issueId) => {
    const currentIssue = filteredIssues.find(issue => issue._id === issueId);
    const alreadyAssignedIds = currentIssue?.assignedTo?.map(emp => emp._id) || [];
    
    return employees.filter(emp => !alreadyAssignedIds.includes(emp._id));
  };

  // Assign employee with AUTO REFRESH
  const assignSingleEmployee = async (issueId, employeeId) => {
    setAssigningIssues(prev => new Set([...prev, issueId]));
    try {
      const response = await fetch(`http://localhost:5000/api/issues/assign/${issueId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId, userIds: [employeeId] }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        const assignedEmployee = employees.find(emp => emp._id === employeeId);
        
        // 1. Close modal
        setSingleAssignModal({ open: false, issueId: null });
        setEmployeeSearch('');
        
        // 2. ✅ REFRESH PARENT DATA
        await triggerRefresh();
        
        // 3. Show success
        setSuccessPopup({
          open: true,
          message: data.message || 'Assigned successfully! ✅',
          employeeName: assignedEmployee?.name || 'Employee'
        });
      }
    } catch (error) {
      console.error('❌ Assign error:', error);
    } finally {
      setAssigningIssues(prev => {
        const newSet = new Set(prev);
        newSet.delete(issueId);
        return newSet;
      });
    }
  };

  // Remove employee with AUTO REFRESH
  const removeEmployeeFromIssue = async (issueId, employeeId) => {
    const key = `${issueId}-${employeeId}`;
    setRemovingEmployees(prev => new Set([...prev, key]));
    try {
      const response = await fetch(`http://localhost:5000/api/issues/remove-employee/${issueId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: employeeId, adminId }),
      });

      if (response.ok) {
        await triggerRefresh();
      }
    } catch (error) {
      console.error('❌ Remove error:', error);
    } finally {
      setRemovingEmployees(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }
  };

  const handleEdit = (id) => {
    onEditIssue(id);
  };

  const handleDelete = async (id) => {
    await onDeleteIssue(id);
    await triggerRefresh();
  };

  return (
    <>
      <motion.section 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
      >
        <div className="px-8 py-8 lg:px-12 lg:py-12">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-10 gap-6">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Project Issues ({filteredIssues.length})
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Admin ID: <span className="font-mono text-indigo-600">{adminId.slice(-6)}</span>
              </p>
            </div>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                placeholder="Search issues..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
            </div>
          </div>

          {/* Issues List */}
          <div className="space-y-6">
            {filteredIssues.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                <Search className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No issues found</h3>
              </div>
            ) : (
              filteredIssues.map((issue, index) => (
                <IssueCard
                  key={issue._id}
                  issue={issue}
                  index={index}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onAssign={() => onAssignClick({ open: true, issueId: issue._id, employeeSearch: "", selectedEmployees: new Set() })}
                  onSingleAssign={() => {
                    fetchEmployees(issue._id); // ✅ Pass current issue ID
                    setSingleAssignModal({ open: true, issueId: issue._id });
                  }}
                  onRemoveEmployee={(empId) => removeEmployeeFromIssue(issue._id, empId)}
                  removingEmployee={(empId) => removingEmployees.has(`${issue._id}-${empId}`)}
                />
              ))
            )}
          </div>
        </div>
      </motion.section>

      {/* ✅ FIXED SingleAssignModal - Hides already assigned employees */}
      {singleAssignModal.open && (
        <SingleAssignModal
          issueId={singleAssignModal.issueId}
          employees={getAvailableEmployeesForIssue(singleAssignModal.issueId)} // ✅ FILTERED EMPLOYEES
          employeeSearch={employeeSearch}
          loadingEmployees={loadingEmployees}
          assigning={assigningIssues.has(singleAssignModal.issueId)}
          onEmployeeSearchChange={setEmployeeSearch}
          onAssign={assignSingleEmployee}
          onClose={() => {
            setSingleAssignModal({ open: false, issueId: null });
            setEmployeeSearch('');
          }}
        />
      )}

      {/* Success Popup */}
      {successPopup.open && (
        <SuccessPopup
          message={successPopup.message}
          employeeName={successPopup.employeeName}
          onClose={() => setSuccessPopup({ open: false, message: '', employeeName: '' })}
        />
      )}
    </>
  );
}

// ✅ FIXED IssueCard - Passes assigning state correctly
function IssueCard({ issue, index, onEdit, onDelete, onAssign, onSingleAssign, onRemoveEmployee, removingEmployee }) {
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

          {/* ASSIGNED EMPLOYEES */}
          {issue.assignedTo && issue.assignedTo.length > 0 ? (
            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Assigned Team</p>
              <div className="flex flex-wrap gap-3">
                {issue.assignedTo.map(emp => (
                  <motion.div
                    key={emp._id}
                    className="group/emp flex items-center gap-3 px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-xl shadow-sm hover:shadow-md hover:bg-indigo-100 transition-all relative overflow-hidden flex-shrink-0"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 text-sm truncate">{emp.name}</p>
                      <p className="text-xs text-gray-500 truncate">
                        ID: {emp._id.slice(-6)}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onRemoveEmployee(emp._id)}
                      disabled={removingEmployee(emp._id)}
                      className="p-1.5 ml-1 bg-red-100 hover:bg-red-200 text-red-700 hover:text-red-900 rounded-lg shadow-sm hover:shadow-md transition-all border border-red-200 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Remove employee from issue"
                    >
                      {removingEmployee(emp._id) ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No employee assigned</p>
              <p className="text-sm text-gray-400">Click "Assign" buttons to add team members</p>
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
          
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            onClick={onSingleAssign}
            className="inline-flex items-center px-5 py-2.5 border border-emerald-300 text-sm font-semibold rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm transition-all duration-200"
          >
            <User className="w-4 h-4 mr-2" />
            Assign One
          </motion.button>

          <motion.button whileHover={{ scale: 1.05 }} onClick={onAssign} className="inline-flex items-center px-5 py-2.5 border border-indigo-300 text-sm font-semibold rounded-xl text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all duration-200">
            <Users className="w-4 h-4 mr-2" /> Assign Team
          </motion.button>
        </div>

        <MediaPreview media={issue.media} />
      </div>
    </motion.div>
  );
}

// ✅ FIXED SingleAssignModal - Only shows available employees
function SingleAssignModal({ 
  issueId, 
  employees,  // ✅ Already filtered by parent
  employeeSearch, 
  loadingEmployees, 
  assigning,
  onEmployeeSearchChange, 
  onAssign, 
  onClose 
}) {
  // ✅ Further filter by search term (only from available employees)
  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
    emp.empId?.toLowerCase().includes(employeeSearch.toLowerCase()) ||
    emp.email.toLowerCase().includes(employeeSearch.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center shadow-sm">
                <User className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Assign Employee</h3>
                <p className="text-sm text-gray-500">
                  {filteredEmployees.length} available • Already assigned employees hidden
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-2xl backdrop-blur-sm transition-all"
              disabled={assigning}
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="px-8 pb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              placeholder="Search available employees..."
              value={employeeSearch}
              onChange={(e) => onEmployeeSearchChange(e.target.value)}
              disabled={assigning}
              className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-all disabled:opacity-50"
            />
          </div>
        </div>

        {/* EMPLOYEES LIST */}
        <div className="px-8 pb-8 max-h-96 overflow-y-auto">
          {loadingEmployees ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mr-3" />
              <span className="text-lg text-gray-600 font-medium">Loading employees...</span>
            </div>
          ) : assigning ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mr-4" />
              <div className="text-center">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Assigning Employee...</h4>
                <p className="text-gray-500">Please wait while we assign the employee</p>
              </div>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                {employeeSearch ? 'No matching employees' : 'No available employees'}
              </h4>
              <p className="text-gray-500 text-lg">
                {employeeSearch 
                  ? 'Try different search terms' 
                  : 'All employees are already assigned to this issue'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredEmployees.map((employee, index) => (
                <motion.div
                  key={employee._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onAssign(issueId, employee._id)}
                    disabled={assigning}
                    className="w-full flex items-center justify-between p-5 border border-gray-200 rounded-2xl hover:bg-emerald-50 hover:border-emerald-300 hover:shadow-md transition-all group bg-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <User className="w-7 h-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-lg text-gray-900 group-hover:text-emerald-900 truncate">{employee.name}</p>
                        <div className="flex items-center gap-4 text-sm mt-0.5 flex-wrap">
                          <span className="font-mono bg-emerald-100 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-800 shadow-sm">{employee.empId}</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-500 truncate max-w-[150px]">{employee.email}</span>
                          <span className="text-gray-500">({employee.role})</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-100 text-emerald-800 rounded-xl font-semibold shadow-sm hover:shadow-md hover:bg-emerald-200 transition-all ml-4 flex-shrink-0">
                      <Users className="w-4 h-4" />
                      <span>Assign</span>
                    </div>
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Success Popup Component (unchanged)
function SuccessPopup({ message, employeeName, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-3xl shadow-2xl max-w-md w-full p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Check className="w-12 h-12 text-white" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Employee Assigned!</h3>
        
        <p className="text-lg text-gray-700 mb-2">
          <span className="font-semibold text-emerald-900">{employeeName}</span>
        </p>
        
        <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto leading-relaxed">{message}</p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className="w-full bg-emerald-600 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-all duration-200 text-lg"
        >
          Done ✅
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// Helper Components (unchanged)
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
