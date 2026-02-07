import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Users,
  User,
  CheckCircle,
  Clock,
  AlertTriangle,
  Image as ImageIcon,
  Pencil,
  Trash2,
  ArrowLeft,
  Loader2,
  X,
  Trash,
  Check,
} from "lucide-react";

export default function ProjectIssues() {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [assignModal, setAssignModal] = useState({
    open: false,
    issueId: null,
  });
  const [adminId, setAdminId] = useState("");
  const [assigningEmployeeId, setAssigningEmployeeId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // ✅ DELETE CONFIRMATION STATE
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    issueId: null,
    issueTitle: "",
  });

  // 1. Fetch admin ID on load
  useEffect(() => {
    const storedId =
      localStorage.getItem("adminId") || "697f7455a657114b9d853f92";
    setAdminId(storedId);
  }, []);

  // 2. Optimized Fetch Function
  const fetchIssues = useCallback(async (showFullLoading = false) => {
    if (showFullLoading) setLoading(true);
    else setIsRefreshing(true);

    try {
      const res = await fetch("http://localhost:5000/api/issues");
      const data = await res.json();
      if (data.success || data.issues) {
        setIssues(data.issues || []);
      }
    } catch (error) {
      console.error("Error fetching issues:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/users");
      const data = await res.json();
      setEmployees(data.users || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Initial Data Load
  useEffect(() => {
    fetchIssues(true);
    fetchEmployees();
  }, [fetchIssues]);

  // 3. ASSIGN SINGLE EMPLOYEE - FIXED
  const assignSingleEmployee = async (issueId, employeeId) => {
    setAssigningEmployeeId(employeeId);
    try {
      const response = await fetch(
        `http://localhost:5000/api/issues/assign/${issueId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adminId, userIds: [employeeId] }),
        },
      );

      if (response.ok) {
        setAssignModal({ open: false, issueId: null });
        await fetchIssues();
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 2000);
      }
    } catch (error) {
      console.error("Assign error:", error);
    } finally {
      setAssigningEmployeeId(null);
    }
  };

  // Check if employee is already assigned to this issue
  const isEmployeeAssigned = useCallback(
    (issueId, employeeId) => {
      const issue = issues.find((issue) => issue._id === issueId);
      if (!issue?.assignedTo) return false;
      return issue.assignedTo.some((emp) => emp._id === employeeId);
    },
    [issues],
  );

  // 4. REMOVE INDIVIDUAL EMPLOYEE
  const removeEmployee = async (issueId, employeeId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/issues/remove-employee/${issueId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: employeeId, adminId }),
        },
      );

      if (response.ok) {
        await fetchIssues();
      }
    } catch (error) {
      console.error("Remove error:", error);
    }
  };

  // ✅ DELETE CONFIRMATION HANDLERS
  const handleDeleteClick = (issueId, issueTitle) => {
    setDeleteConfirm({
      open: true,
      issueId,
      issueTitle,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/issues/${deleteConfirm.issueId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchIssues();
      }
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeleteConfirm({ open: false, issueId: null, issueTitle: "" });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ open: false, issueId: null, issueTitle: "" });
  };

  const handleEdit = (issueId) => {
    navigate(`/admin/issues/edit/${issueId}`);
  };

  const filteredIssues = issues.filter(
    (issue) =>
      issue.title.toLowerCase().includes(search.toLowerCase()) ||
      (issue.description &&
        issue.description.toLowerCase().includes(search.toLowerCase())),
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading issues...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-4 md:p-8">
      {/* Subtle Refresh Indicator */}
      {isRefreshing && (
        <div className="fixed top-4 right-4 z-50 bg-white px-3 py-1 rounded-full shadow-md flex items-center gap-2 border border-indigo-100">
          <Loader2 className="w-3 h-3 text-indigo-600 animate-spin" />
          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
            Syncing
          </span>
        </div>
      )}

      {/* Navigation */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed top-6 left-6 z-50 w-10 h-10 bg-white shadow-lg border border-gray-100 rounded-xl flex items-center justify-center hover:shadow-xl transition-all"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-5 h-5 text-gray-700" />
      </motion.button>

      <div className="max-w-5xl mx-auto mt-12">
        {/* Header Section */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                Project Issues
                <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg text-lg">
                  ({filteredIssues.length})
                </span>
              </h1>
              <p className="text-xs text-gray-400 font-mono mt-1 uppercase tracking-tighter">
                Admin Session: {adminId.slice(-6)}
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                placeholder="Search issues..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Issues Grid/List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredIssues.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200"
              >
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">
                  No issues match your search.
                </p>
              </motion.div>
            ) : (
              filteredIssues.map((issue) => (
                <motion.div
                  key={issue._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 hover:shadow-xl hover:border-indigo-200 transition-all group"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Content Left */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                          {issue.title}
                        </h3>
                      </div>

                      <p className="text-gray-500 text-[15px] mb-5 line-clamp-2">
                        {issue.description || "No description provided."}
                      </p>

                      {/* Team Section */}
                      <div className="space-y-2">
                        <span className="text-[13px] font-bold text-gray-400 tracking-widest">
                          Assigned Team
                        </span>
                        <div className="flex flex-wrap mt-3.5 gap-2">
                          {issue.assignedTo && issue.assignedTo.length > 0 ? (
                            issue.assignedTo.map((emp) => (
                              <div
                                key={emp._id}
                                className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 pl-2 pr-1 py-1 rounded-lg"
                              >
                                <User className="h-5 w-5 text-indigo-500"/>
                                <span className="text-[15px] pl-2 font-bold text-indigo-700">
                                  {emp.name}
                                </span>
                                <button
                                  onClick={() =>
                                    removeEmployee(issue._id, emp._id)
                                  }
                                  className="p-1 hover:bg-red-100 bg-red-50 text-red-300 hover:text-red-400 rounded-md transition-colors"
                                >
                                  <Trash className="w-5 h-5" />
                                </button>
                              </div>
                            ))
                          ) : (
                            <div className="text-[15px] text-gray-400 italic bg-gray-50 px-4 py-1 rounded-lg border border-dashed border-gray-200">
                              No employees assigned yet
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Metadata & Actions Right */}
                    <div className="flex flex-col md:flex-row lg:flex-col items-start md:items-center lg:items-end gap-4 min-w-[280px]">
                      <div className="flex flex-wrap gap-2 md:flex-1 lg:flex-none">
                        {/* Priority Badge */}
                        <div
                          className={`px-5 py-3 rounded-full text-[12px] font-black uppercase tracking-wider border-2 ${
                            issue.priority === "high"
                              ? "bg-red-50 text-red-600 border-red-100"
                              : issue.priority === "medium"
                              ? "bg-amber-50 text-amber-600 border-amber-100"
                              : "bg-emerald-50 text-emerald-600 border-emerald-100"
                          }`}
                        >
                          {issue.priority || "Medium"}
                        </div>

                        {/* Status Badge */}
                        <div
                          className={`px-5 py-3 rounded-full text-[13px] font-black uppercase tracking-wider border-2 flex items-center gap-1.5 ${
                            issue.status === "fixed"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : issue.status === "progress"
                              ? "bg-blue-50 text-blue-600 border-blue-100"
                              : "bg-slate-50 text-slate-500 border-slate-100"
                          }`}
                        >
                          {issue.status === "fixed" ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : issue.status === "progress" ? (
                            <Clock className="w-5 h-5" />
                          ) : (
                            <AlertTriangle className="w-5 h-5" />
                          )}
                          {issue.status || "Pending"}
                        </div>
                      </div>

                      {/* Media Preview */}
                      <div className="w-36 h-28 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-inner group-hover:border-indigo-200 transition-all">
                        {issue.media ? (
                          issue.media.toLowerCase().endsWith(".mp4") ? (
                            <video
                              src={`http://localhost:5000/uploads/${issue.media}`}
                              className="w-full h-full object-cover"
                              muted
                            />
                          ) : (
                            <img
                              src={`http://localhost:5000/uploads/${issue.media}`}
                              className="w-full h-full object-cover"
                              alt="issue"
                            />
                          )
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-gray-300" />
                          </div>
                        )}
                      </div>

                      {/* ✅ REARRANGED Action Grid - FORMAL LAYOUT */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            setAssignModal({ open: true, issueId: issue._id })
                          }
                          className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-semibold border border-blue-200 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 hover:border-blue-300 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 order-2"
                        >
                          <User className="w-3 h-3" /> Assign
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleEdit(issue._id)}
                          className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-semibold border border-blue-200 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 hover:border-blue-300 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 order-2"
                        >
                          <Pencil className="w-3 h-3" /> Edit
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleDeleteClick(issue._id, issue.title)}
                          className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-semibold border border-gray-200 bg-gray-50 text-gray-500 hover:text-red-500 rounded-lg hover:bg-red-100 hover:border-red-300 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-500 order-3"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ASSIGN MODAL - FORMAL VERSION */}
      <AnimatePresence>
        {assignModal.open && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white border border-gray-200 rounded-2xl shadow-xl max-w-md w-full max-h-[85vh] overflow-hidden"
            >
              {/* Formal Header */}
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-gray-100 border-2 border-gray-200 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Assign Employee
                      </h3>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                        Select from available users
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setAssignModal({ open: false, issueId: null })
                    }
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="p-5 border-b border-gray-100 bg-white">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Employees List */}
              <div className="p-5 max-h-[450px] overflow-y-auto custom-scrollbar bg-gray-50">
                <div className="space-y-2">
                  {employees.map((employee) => {
                    const isAssigned = isEmployeeAssigned(
                      assignModal.issueId,
                      employee._id,
                    );
                    const isCurrentlyAssigning =
                      assigningEmployeeId === employee._id;

                    if (isAssigned) return null;

                    return (
                      <motion.button
                        key={employee._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isCurrentlyAssigning}
                        onClick={() =>
                          assignSingleEmployee(
                            assignModal.issueId,
                            employee._id,
                          )
                        }
                        className="group w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center group-hover:bg-indigo-100 group-hover:border-indigo-200 transition-colors">
                            <span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600">
                              {employee.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="text-left min-w-0 flex-1">
                            <p className="font-medium text-sm text-gray-900 truncate group-hover:text-gray-800">
                              {employee.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {employee.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          {isCurrentlyAssigning ? (
                            <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-semibold">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Assigning
                            </div>
                          ) : (
                            <div className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-lg text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap">
                              Assign User
                            </div>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ✅ DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteConfirm.open && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white border border-gray-200 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh]"
            >
              <div className="p-8 text-center border-b border-gray-100 bg-gray-50">
                <div className="w-16 h-16 mx-auto bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Delete Issue
                </h3>
                <p className="text-sm text-gray-500 mb-1">
                  Are you sure you want to delete
                </p>
                <p className="font-semibold text-gray-900 text-base">
                  "{deleteConfirm.issueTitle}"
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  This action cannot be undone.
                </p>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <div className="flex gap-3 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDeleteCancel}
                    className="flex-1 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDeleteConfirm}
                    className="flex-1 px-6 py-2.5 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete Issue
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* NEW SUCCESS POPUP */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-20 right-6 z-[200] bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl border border-emerald-400 flex items-center gap-3"
          >
            <Check className="w-5 h-5" />
            <span className="font-bold text-sm">
              Employee assigned successfully!
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
          transition: background 0.2s;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
