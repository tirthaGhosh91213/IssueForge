import { motion } from "framer-motion";
import { Search, X, Check, User, Loader2, Mail, Users } from "lucide-react";
import { useState, useEffect } from "react";

export default function AssignModal({ 
  assignModal, 
  filteredEmployees,  // ✅ Will be filtered by parent
  issueId,            // ✅ NEW: Need issue ID to check assigned employees
  currentIssue,       // ✅ NEW: Current issue data to get assignedTo
  onClose, 
  onEmployeeSearchChange, 
  onToggleEmployee, 
  onAssign,
  isAssigning,
  onSuccessClose
}) {
  // ✅ Local state for already assigned employees tracking
  const [alreadyAssignedIds, setAlreadyAssignedIds] = useState(new Set());

  // ✅ Filter employees locally - Hide already assigned ones
  const availableEmployees = filteredEmployees.filter(emp => 
    !alreadyAssignedIds.has(emp._id)
  );

  // ✅ Search within available employees only
  const searchFilteredEmployees = availableEmployees.filter(emp =>
    emp.name.toLowerCase().includes(assignModal.employeeSearch.toLowerCase()) ||
    emp.email.toLowerCase().includes(assignModal.employeeSearch.toLowerCase()) ||
    emp.empId?.toLowerCase().includes(assignModal.employeeSearch.toLowerCase())
  );

  // ✅ Update already assigned when currentIssue changes
  useEffect(() => {
    if (currentIssue?.assignedTo) {
      const assignedIds = currentIssue.assignedTo.map(emp => emp._id);
      setAlreadyAssignedIds(new Set(assignedIds));
    }
  }, [currentIssue]);

  // ✅ Update already assigned when issueId changes (from parent prop)
  useEffect(() => {
    if (issueId && assignModal.issueId) {
      // This would typically fetch current issue data, but since parent passes it
      // we rely on currentIssue prop
    }
  }, [issueId, assignModal.issueId]);

  return (
    <>
      {/* MAIN ASSIGN MODAL */}
      {assignModal.open && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex items-center justify-center p-4" onClick={onClose}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden" 
            onClick={e => e.stopPropagation()}
          >
            <div className="p-8 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shadow-sm">
                    <Users className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Assign Team Members</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {availableEmployees.length} available • {alreadyAssignedIds.size} already assigned
                    </p>
                  </div>
                </div>
                <button 
                  onClick={onClose} 
                  className="p-2 text-gray-400 hover:text-gray-500 rounded-xl hover:bg-gray-100 transition-colors" 
                  disabled={isAssigning}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-8 max-h-[500px] overflow-y-auto">
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  placeholder="Search available employees by name, email or ID..."
                  value={assignModal.employeeSearch}
                  onChange={onEmployeeSearchChange}
                  disabled={isAssigning}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* ✅ Selected Count - Only available employees */}
              {assignModal.selectedEmployees.size > 0 && (
                <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                  <p className="text-sm font-semibold text-indigo-800 flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    {assignModal.selectedEmployees.size} available employee{assignModal.selectedEmployees.size > 1 ? 's' : ''} selected
                  </p>
                </div>
              )}

              {/* ✅ Already Assigned Warning */}
              {alreadyAssignedIds.size > 0 && availableEmployees.length === 0 && (
                <div className="mb-6 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-2xl text-center">
                  <Users className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-yellow-900 mb-2">No Available Employees</h4>
                  <p className="text-yellow-800 text-sm">
                    All {alreadyAssignedIds.size} employees are already assigned to this issue
                  </p>
                </div>
              )}

              {searchFilteredEmployees.length === 0 ? (
                alreadyAssignedIds.size === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">
                      {assignModal.employeeSearch ? 'No matching employees' : 'No employees available'}
                    </p>
                    <p className="text-sm mt-2">
                      {assignModal.employeeSearch ? 'Try different search terms' : 'Load employees first'}
                    </p>
                  </div>
                ) : null // Don't show empty state if already assigned warning is shown
              ) : (
                <div className="space-y-3">
                  {searchFilteredEmployees.map((emp) => {
                    const isSelected = assignModal.selectedEmployees.has(emp._id);
                    return (
                      <motion.button
                        key={emp._id}
                        whileHover={isAssigning ? {} : { scale: isSelected ? 1 : 1.02 }}
                        whileTap={isAssigning ? {} : { scale: 0.98 }}
                        onClick={() => !isAssigning && onToggleEmployee(emp._id)}
                        disabled={isAssigning}
                        className={`w-full flex items-center gap-4 p-5 border-2 rounded-xl transition-all duration-300 shadow-sm ${
                          isSelected 
                            ? 'border-indigo-500 bg-indigo-50 shadow-md ring-2 ring-indigo-200/50' 
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                        } ${isAssigning ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md transition-all duration-200 ${
                          isSelected 
                            ? 'bg-indigo-600 text-white ring-2 ring-white/50' 
                            : 'bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
                        }`}>
                          {isSelected ? <Check className="w-6 h-6" /> : <User className="w-6 h-6" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-lg text-gray-900 truncate">{emp.name}</p>
                          <p className="text-sm text-gray-600 truncate">{emp.email}</p>
                          <p className="text-xs font-mono text-gray-500 mt-1 bg-gray-100 px-2 py-1 rounded-lg inline-block">
                            ID: {emp._id.slice(-8)}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="flex items-center gap-1 text-indigo-600 font-semibold text-sm bg-indigo-100 px-3 py-1 rounded-xl">
                            <Check className="w-4 h-4" /> Selected
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ✅ SPINNER DURING ASSIGNING */}
            {isAssigning && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="text-center p-8">
                  <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-900 mb-2">Sending assignment emails...</p>
                  <p className="text-sm text-gray-600">Please wait while we notify the team</p>
                </div>
              </div>
            )}

            <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <button 
                  onClick={onClose} 
                  disabled={isAssigning}
                  className="px-6 py-2.5 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={onAssign}
                  disabled={assignModal.selectedEmployees.size === 0 || isAssigning}
                  className="px-8 py-2.5 border border-transparent text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                >
                  {isAssigning ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Assign Team ({assignModal.selectedEmployees.size})
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ✅ SUCCESS POPUP */}
      {assignModal.success && (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4"
          onClick={onSuccessClose}
        >
          <motion.div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center max-h-[90vh] overflow-hidden" 
            onClick={e => e.stopPropagation()}
          >
            <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Check className="w-12 h-12 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Team Assigned Successfully!</h3>
            <p className="text-gray-600 mb-8">
              Assignment emails sent to {assignModal.selectedEmployees.size} employee{assignModal.selectedEmployees.size !== 1 ? 's' : ''}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSuccessClose}
              className="w-full px-8 py-3 border border-transparent text-lg font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-lg transition-all duration-200"
            >
              Done
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
