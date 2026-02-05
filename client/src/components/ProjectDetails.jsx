import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  X,
  Github,
  Plus,
  Pencil,
  Trash2,
  User,
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  Loader2,
  Check
} from "lucide-react";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [issues, setIssues] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [showImage, setShowImage] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [assignModal, setAssignModal] = useState({ 
    open: false, 
    issueId: null,
    employeeSearch: "",
    selectedEmployees: new Set()
  });

  // ================= FETCH DATA =================
  useEffect(() => {
    fetch(`http://localhost:5000/api/admin/project/${id}`)
      .then(r => r.json())
      .then(d => setProject(d.project));

    fetchIssues();

    fetch("http://localhost:5000/api/admin/users")
      .then(r => r.json())
      .then(d => setEmployees(d.users || []));
  }, [id]);

  const fetchIssues = () => {
    fetch(`http://localhost:5000/api/issues?project=${id}`)
      .then(r => r.json())
      .then(d => setIssues(d.issues || []));
  };

  // ================= MULTIPLE ASSIGN =================
  const handleAssignMultiple = async (issueId) => {
    const selectedIds = Array.from(assignModal.selectedEmployees);
    if (selectedIds.length === 0) return;

    // Backend expects array of employee IDs for multiple assignment
    await fetch(`http://localhost:5000/api/issues/assign-multiple/${issueId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignedTo: selectedIds }),
    });

    setAssignModal({ open: false, issueId: null, employeeSearch: "", selectedEmployees: new Set() });
    fetchIssues(); // Refresh to show updated assigned employees
  };

  const toggleEmployee = (empId) => {
    const newSet = new Set(assignModal.selectedEmployees);
    if (newSet.has(empId)) {
      newSet.delete(empId);
    } else {
      newSet.add(empId);
    }
    setAssignModal(prev => ({ ...prev, selectedEmployees: newSet }));
  };

  // ================= OTHER ACTIONS =================
  const handleDelete = async () => {
    if (!window.confirm("Delete this project?")) return;
    await fetch(`http://localhost:5000/api/admin/project/${id}`, { method: "DELETE" });
    navigate(-1);
  };

  const handleDeleteIssue = async (issueId) => {
    if (!window.confirm("Delete this issue?")) return;
    await fetch(`http://localhost:5000/api/issues/${issueId}`, { method: "DELETE" });
    fetchIssues();
  };

  const handleEditIssue = (issueId) => {
    navigate(`/admin/issues/edit/${issueId}`);
  };

  if (!project) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-12">
        <Loader2 className="w-16 h-16 text-gray-400 animate-spin mx-auto mb-6" />
        <p className="text-xl text-gray-600 font-medium">Loading project details</p>
      </div>
    </div>
  );

  // ================= FILTERS =================
  const filteredIssues = issues.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase())
  );

  const filteredEmployees = assignModal.open 
    ? employees.filter(emp => 
        emp.name.toLowerCase().includes(assignModal.employeeSearch.toLowerCase()) ||
        emp.email.toLowerCase().includes(assignModal.employeeSearch.toLowerCase())
      )
    : employees;

  const words = project.description?.split(" ") || [];
  const desc = words.length > 30 && !showFullDesc
    ? words.slice(0, 30).join(" ") + "..."
    : project.description;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* BACK BUTTON */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </motion.button>

        {/* ================= PROJECT HEADER ================= */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-2xl shadow-sm mb-12 overflow-hidden"
        >
          <div className="p-8 lg:p-12">
            <div className="lg:flex lg:items-start lg:gap-10">
              
              {/* PROJECT IMAGE */}
              <div className="flex-shrink-0 mb-8 lg:mb-0">
                <div className="relative">
                  <img
                    src={`http://localhost:5000/uploads/${project.image}`}
                    onClick={() => setShowImage(true)}
                    className="w-64 h-48 lg:w-80 lg:h-56 object-cover rounded-xl border-4 border-gray-200 shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
                    alt={project.name}
                  />
                  <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-md border border-gray-200">
                    <User className="w-6 h-6 text-gray-700" />
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <div className="mb-6">
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                    {project.name}
                  </h1>
                  <p className="mt-3 text-sm text-gray-500">Project Management Dashboard</p>
                </div>

                <div className="prose prose-lg max-w-none mb-8">
                  <p className="text-gray-700 leading-relaxed">{desc}
                    {words.length > 30 && (
                      <button
                        onClick={() => setShowFullDesc(!showFullDesc)}
                        className="ml-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm underline"
                      >
                        {showFullDesc ? "Show less" : "Read more"}
                      </button>
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    onClick={() => navigate(`/admin/issues/create/${id}`)} 
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    New Issue
                  </motion.button>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    onClick={() => navigate(`/admin/project/edit/${id}`)} 
                    className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Pencil className="w-5 h-5 mr-2" />
                    Edit Project
                  </motion.button>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    onClick={handleDelete} 
                    className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Delete
                  </motion.button>

                  {project.githubUrl && (
                    <motion.a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Github className="w-5 h-5 mr-2" />
                      GitHub
                    </motion.a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ================= ISSUES SECTION ================= */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="px-8 py-8 lg:px-12 lg:py-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-10 gap-6">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Project Issues ({filteredIssues.length})
                </h2>
                <p className="text-sm text-gray-500 mt-1">Manage tasks and track progress</p>
              </div>
              
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  placeholder="Search issues by title or description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                />
              </div>
            </div>

            {/* ISSUES LIST */}
            <div className="space-y-6">
              {filteredIssues.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                  <Search className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No issues found</h3>
                  <p className="text-gray-500 text-lg">Try adjusting your search or create a new issue</p>
                </div>
              ) : (
                filteredIssues.map((issue, index) => (
                  <motion.div
                    key={issue._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group border border-gray-200 rounded-2xl p-8 hover:shadow-lg hover:border-gray-300 transition-all duration-300 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 items-start lg:items-center gap-8 lg:gap-6">
                      
                      {/* ISSUE DETAILS - LEFT */}
                      <div className="lg:col-span-6 space-y-4">
                        <div>
                          <h4 className="text-2xl font-bold text-gray-900 leading-tight group-hover:text-indigo-900 transition-colors">
                            {issue.title}
                          </h4>
                          <p className="text-gray-600 mt-2 leading-relaxed text-lg">
                            {issue.description}
                          </p>
                        </div>

                        {/* ✅ SELECTED EMPLOYEES HIGHLIGHT SECTION */}
                        {issue.assignedTo && Array.isArray(issue.assignedTo) && issue.assignedTo.length > 0 ? (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-xl p-6 shadow-lg"
                          >
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse" />
                              <h5 className="text-lg font-bold text-indigo-900 uppercase tracking-wide">
                                Assigned Team ({issue.assignedTo.length})
                              </h5>
                            </div>
                            
                            <div className="flex flex-wrap gap-3">
                              {issue.assignedTo.map((emp, empIndex) => (
                                <motion.div
                                  key={emp._id}
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ delay: empIndex * 0.1 }}
                                  className="group/emp flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-indigo-300 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200 hover:border-indigo-400"
                                >
                                  <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                                    <User className="w-5 h-5 text-white" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-gray-900 truncate text-sm">
                                      {emp.name}
                                    </p>
                                    <p className="text-xs font-mono text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded-full truncate">
                                      ID: {emp._id.slice(-8)}
                                    </p>
                                  </div>
                                  <Check className="w-5 h-5 text-indigo-600 group-hover/emp:scale-110 transition-transform" />
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        ) : (
                          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">No team assigned</p>
                            <p className="text-sm text-gray-400">Click "Assign Team" to add members</p>
                          </div>
                        )}
                      </div>

                      {/* STATUS & PRIORITY - CENTER */}
                      <div className="lg:col-span-2 flex flex-col gap-6 justify-center lg:justify-start">
                        <div className="flex flex-col items-center lg:items-start gap-2">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Priority</span>
                          <span className={`px-4 py-2 rounded-lg text-sm font-bold border-2 shadow-sm ${
                            issue.priority === 'low' ? 'bg-green-50 border-green-200 text-green-800' :
                            issue.priority === 'medium' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                            'bg-red-50 border-red-200 text-red-800'
                          }`}>
                            {issue.priority?.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="flex flex-col items-center lg:items-start gap-2">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</span>
                          <span className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 border-2 shadow-sm ${
                            issue.status === 'done' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                            issue.status === 'progress' ? 'bg-blue-50 border-blue-200 text-blue-800' :
                            'bg-gray-50 border-gray-200 text-gray-800'
                          }`}>
                            {issue.status === 'done' && <CheckCircle className="w-4 h-4" />}
                            {issue.status === 'progress' && <Clock className="w-4 h-4" />}
                            {issue.status === 'pending' && <AlertTriangle className="w-4 h-4" />}
                            <span className="capitalize">{issue.status}</span>
                          </span>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="lg:col-span-2 flex flex-wrap gap-3 justify-center lg:justify-end order-3 lg:order-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          onClick={() => handleEditIssue(issue._id)}
                          className="px-5 py-2.5 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all duration-200"
                        >
                          <Pencil className="w-4 h-4 inline mr-2" />
                          Edit
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          onClick={() => handleDeleteIssue(issue._id)}
                          className="px-5 py-2.5 border border-red-300 text-sm font-medium rounded-xl text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4 inline mr-2" />
                          Delete
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          onClick={() => setAssignModal({ 
                            open: true, 
                            issueId: issue._id, 
                            employeeSearch: "", 
                            selectedEmployees: new Set() 
                          })}
                          className="inline-flex items-center px-5 py-2.5 border border-indigo-300 text-sm font-semibold rounded-xl text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all duration-200"
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Assign Team
                        </motion.button>
                      </div>

                      {/* MEDIA - FAR RIGHT */}
                      <div className="lg:col-span-2 flex justify-end order-last">
                        <div className="relative">
                          {issue.media?.endsWith(".mp4") ? (
                            <video
                              src={`http://localhost:5000/uploads/${issue.media}`}
                              className="w-44 h-32 lg:w-52 lg:h-36 object-cover rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300"
                              controls
                            />
                          ) : issue.media ? (
                            <img
                              src={`http://localhost:5000/uploads/${issue.media}`}
                              className="w-44 h-32 lg:w-52 lg:h-36 object-cover rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
                              alt="Issue media"
                            />
                          ) : (
                            <div className="w-44 h-32 lg:w-52 lg:h-36 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300">
                              <Search className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.section>

        {/* ================= ASSIGN TEAM MODAL ================= */}
        {assignModal.open && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex items-center justify-center p-4" onClick={() => setAssignModal({ open: false, issueId: null, employeeSearch: "", selectedEmployees: new Set() })}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="p-8 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Assign Team Members</h3>
                    <p className="text-sm text-gray-500 mt-1">Select employees for this issue</p>
                  </div>
                  <button
                    onClick={() => setAssignModal({ open: false, issueId: null, employeeSearch: "", selectedEmployees: new Set() })}
                    className="p-2 text-gray-400 hover:text-gray-500 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-8 max-h-[500px] overflow-y-auto">
                {/* SEARCH */}
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    placeholder="Search employees by name or email..."
                    value={assignModal.employeeSearch}
                    onChange={(e) => setAssignModal(prev => ({ ...prev, employeeSearch: e.target.value }))}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  />
                </div>

                {/* SELECTION SUMMARY */}
                {assignModal.selectedEmployees.size > 0 && (
                  <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                    <p className="text-sm font-semibold text-indigo-800 flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      {assignModal.selectedEmployees.size} employee{assignModal.selectedEmployees.size > 1 ? 's' : ''} selected
                    </p>
                  </div>
                )}

                {/* EMPLOYEES LIST */}
                {filteredEmployees.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No employees found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredEmployees.map((emp) => {
                      const isSelected = assignModal.selectedEmployees.has(emp._id);
                      return (
                        <motion.button
                          key={emp._id}
                          whileHover={{ scale: isSelected ? 1 : 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleEmployee(emp._id)}
                          className={`w-full flex items-center gap-4 p-5 border-2 rounded-xl transition-all duration-300 shadow-sm ${
                            isSelected 
                              ? 'border-indigo-500 bg-indigo-50 shadow-md ring-2 ring-indigo-200/50' 
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md transition-all duration-200 ${
                            isSelected 
                              ? 'bg-indigo-600 text-white ring-2 ring-white/50' 
                              : 'bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
                          }`}>
                            {isSelected ? (
                              <Check className="w-6 h-6" />
                            ) : (
                              <User className="w-6 h-6" />
                            )}
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
                              <Check className="w-4 h-4" />
                              Selected
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* MODAL FOOTER */}
              <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setAssignModal({ open: false, issueId: null, employeeSearch: "", selectedEmployees: new Set() })}
                    className="px-6 py-2.5 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAssignMultiple(assignModal.issueId)}
                    disabled={assignModal.selectedEmployees.size === 0}
                    className="px-8 py-2.5 border border-transparent text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Assign Team ({assignModal.selectedEmployees.size})
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* IMAGE MODAL */}
        {showImage && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex items-center justify-center p-6" onClick={() => setShowImage(false)}>
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="max-w-4xl max-h-full bg-white rounded-2xl shadow-2xl overflow-hidden" 
              onClick={e => e.stopPropagation()}
            >
              <img 
                src={`http://localhost:5000/uploads/${project.image}`} 
                className="w-full h-auto max-h-[90vh] object-contain"
                alt={project.name}
              />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
