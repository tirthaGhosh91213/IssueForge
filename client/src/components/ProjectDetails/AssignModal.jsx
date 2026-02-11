import { motion } from "framer-motion";
import { Search, X, Check, User, Loader2, Mail, Users } from "lucide-react";
import { useState, useEffect } from "react";

export default function AssignModal({ 
  assignModal, 
  filteredEmployees,
  issueId,
  currentIssue,
  onClose, 
  onEmployeeSearchChange, 
  onToggleEmployee, 
  onAssign,
  isAssigning,
  onSuccessClose
}) {
  const [alreadyAssignedIds, setAlreadyAssignedIds] = useState(new Set());

  const availableEmployees = filteredEmployees.filter(
    emp => !alreadyAssignedIds.has(emp._id)
  );

  const searchFilteredEmployees = availableEmployees.filter(emp =>
    emp.name.toLowerCase().includes(assignModal.employeeSearch.toLowerCase()) ||
    emp.email.toLowerCase().includes(assignModal.employeeSearch.toLowerCase()) ||
    emp.empId?.toLowerCase().includes(assignModal.employeeSearch.toLowerCase())
  );

  useEffect(() => {
    if (currentIssue?.assignedTo) {
      setAlreadyAssignedIds(
        new Set(currentIssue.assignedTo.map(emp => emp._id))
      );
    }
  }, [currentIssue]);

  return (
    <>
      {assignModal.open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
          >
            {/* HEADER */}
            <div className="p-8 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Assign Team Members
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {availableEmployees.length} available •{" "}
                      {alreadyAssignedIds.size} already assigned
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  disabled={isAssigning}
                  className="p-2 text-gray-400 hover:text-gray-500 rounded-xl hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* SCROLLABLE CONTENT */}
            <div className="p-8 overflow-y-auto flex-1">
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  placeholder="Search available employees by name, email or ID..."
                  value={assignModal.employeeSearch}
                  onChange={onEmployeeSearchChange}
                  disabled={isAssigning}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {assignModal.selectedEmployees.size > 0 && (
                <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                  <p className="text-sm font-semibold text-indigo-800 flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    {assignModal.selectedEmployees.size} selected
                  </p>
                </div>
              )}

              {searchFilteredEmployees.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No matching employees</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {searchFilteredEmployees.map(emp => {
                    const isSelected =
                      assignModal.selectedEmployees.has(emp._id);
                    return (
                      <motion.button
                        key={emp._id}
                        onClick={() =>
                          !isAssigning && onToggleEmployee(emp._id)
                        }
                        disabled={isAssigning}
                        className={`w-full flex items-center gap-4 p-5 border-2 rounded-xl ${
                          isSelected
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200"
                        }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            isSelected
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-100"
                          }`}
                        >
                          {isSelected ? (
                            <Check className="w-6 h-6" />
                          ) : (
                            <User className="w-6 h-6" />
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-semibold text-gray-900">
                            {emp.name}
                          </p>
                          <p className="text-sm text-gray-600">{emp.email}</p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* FOOTER (ALWAYS VISIBLE) */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex-shrink-0">
              <div className="flex justify-between items-center">
                <button
                  onClick={onClose}
                  disabled={isAssigning}
                  className="px-6 py-2.5 border border-gray-300 rounded-xl bg-white"
                >
                  Cancel
                </button>
                <button
                  onClick={onAssign}
                  disabled={
                    assignModal.selectedEmployees.size === 0 || isAssigning
                  }
                  className="px-8 py-2.5 rounded-xl text-white bg-indigo-600 flex items-center gap-2"
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
    </>
  );
}
