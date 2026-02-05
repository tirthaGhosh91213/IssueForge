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
  UserPlus,
  Loader2,
  Users
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

    await fetch(`http://localhost:5000/api/issues/assign-multiple/${issueId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignedTo: selectedIds }),
    });

    setAssignModal({ open: false, issueId: null, employeeSearch: "", selectedEmployees: new Set() });
    fetchIssues();
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
                  <p className="mt-3 text-sm text-gray-500">Project Management</p>
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
                    Edit
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

        {/* ================= ISSUES TABLE ================= */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="px-8 py-8 lg:px-12 lg:py-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-10 gap-6">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Issues ({filteredIssues.length})
                </h2>
                <p className="text-sm text-gray-500 mt-1">Manage and track project issues</p>
              </div>
              
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  placeholder="Search issues..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* ISSUES GRID */}
            <div className="space-y-4">
              {filteredIssues.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No issues found</h3>
                  <p className="text-gray-500">Try adjusting your search terms</p>
                </div>
              ) : (
                filteredIssues.map((issue, index) => (
                  <motion.div
                    key={issue._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 items-start lg:items-center gap-6 lg:gap-8">
                      
                      {/* ISSUE DETAILS */}
                      <div className="lg:col-span-5">
                        <h4 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">
                          {issue.title}
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                          {issue.description}
                        </p>
                        
                        {/* ASSIGNED EMPLOYEES */}
                        {issue.assignedTo && Array.isArray(issue.assignedTo) && issue.assignedTo.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                              Assigned To ({issue.assignedTo.length})
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {issue.assignedTo.map((emp) => (
                                <div key={emp._id} className="inline-flex items-center px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-lg text-xs font-medium text-indigo-800">
                                  <User className="w-3 h-3 mr-1" />
                                  {emp.name}
                                  <span className="ml-1 font-mono text-indigo-600 text-[10px] bg-indigo-100 px-1 py-0.5 rounded ml-2">
                                    {emp._id.slice(-6)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* PRIORITY & STATUS */}
                      <div className="lg:col-span-2 flex flex-col sm:flex-row gap-4 lg:flex-col xl:flex-row justify-center lg:justify-start">
                        <div className="flex flex-col items-center lg:items-start gap-1">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Priority</span>
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border inline-flex items-center ${
                            issue.priority === 'low' ? 'bg-green-50 border-green-200 text-green-800' :
                            issue.priority === 'medium' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                            'bg-red-50 border-red-200 text-red-800'
                          }`}>
                            {issue.priority.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="flex flex-col items-center lg:items-start gap-1">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</span>
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                            issue.status === 'done' ? 'bg-green-50 border-green-200 text-green-800' :
                            issue.status === 'progress' ? 'bg-blue-50 border-blue-200 text-blue-800' :
                            'bg-gray-50 border-gray-200 text-gray-800'
                          }`}>
                            {issue.status === 'done' && <CheckCircle className="w-3 h-3" />}
                            {issue.status === 'progress' && <Clock className="w-3 h-3" />}
                            {issue.status}
                          </span>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="lg:col-span-3 flex flex-wrap gap-3 justify-center lg:justify-start order-3 lg:order-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handleEditIssue(issue._id)}
                          className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          Edit
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handleDeleteIssue(issue._id)}
                          className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          Delete
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          onClick={() => setAssignModal({ open: true, issueId: issue._id, employeeSearch: "", selectedEmployees: new Set() })}
                          className="inline-flex items-center px-4 py-2 border border-indigo-300 text-sm font-medium rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Assign Team
                        </motion.button>
                      </div>

                      {/* MEDIA - FAR RIGHT */}
                      <div className="lg:col-span-2 flex justify-end order-last">
                        {issue.media?.endsWith(".mp4") ? (
                          <video
                            src={`http://localhost:5000/uploads/${issue.media}`}
                            className="w-32 h-24 lg:w-40 lg:h-28 object-cover rounded-lg shadow-sm border border-gray-200"
                            controls
                          />
                        ) : issue.media ? (
                          <img
                            src={`http://localhost:5000/uploads/${issue.media}`}
                            className="w-32 h-24 lg:w-40 lg:h-28 object-cover rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md"
                            alt="Issue media"
                          />
                        ) : (
                          <div className="w-32 h-24 lg:w-40 lg:h-28 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <Search className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50" onClick={() => setAssignModal({ open: false, issueId: null, employeeSearch: "", selectedEmployees: new Set() })}>
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0" onClick={e => e.stopPropagation()}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
              >
                <div className="px-8 pt-8 pb-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Assign Team Members</h3>
                    <button
                      onClick={() => setAssignModal({ open: false, issueId: null, employeeSearch: "", selectedEmployees: new Set() })}
                      className="ml-2 inline-flex items-center rounded-full p-2 bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* SEARCH */}
                  <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      placeholder="Search employees by name or email..."
                      value={assignModal.employeeSearch}
                      onChange={(e) => setAssignModal(prev => ({ ...prev, employeeSearch: e.target.value }))}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* SELECTED COUNT */}
                  {assignModal.selectedEmployees.size > 0 && (
                    <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                      <p className="text-sm font-medium text-indigo-800">
                        <Users className="w-4 h-4 inline mr-2" />
                        {assignModal.selectedEmployees.size} employee{assignModal.selectedEmployees.size !== 1 ? 's' : ''} selected
                      </p>
                    </div>
                  )}

                  {/* EMPLOYEES LIST */}
                  <div className="max-h-96 overflow-y-auto space-y-3">
                    {filteredEmployees.map((emp) => {
                      const isSelected = assignModal.selectedEmployees.has(emp._id);
                      return (
                        <motion.button
                          key={emp._id}
                          whileHover={{ scale: isSelected ? 1 : 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleEmployee(emp._id)}
                          className={`w-full flex items-center gap-4 p-4 border rounded-xl transition-all duration-200 ${
                            isSelected 
                              ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
                          }`}>
                            <User className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{emp.name}</p>
                            <p className="text-sm text-gray-500 truncate">{emp.email}</p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              isSelected 
                                ? 'bg-indigo-100 text-indigo-800' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {isSelected ? 'Selected' : 'Select'}
                            </span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
                  <div className="flex justify-between">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      className="px-6 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => setAssignModal({ open: false, issueId: null, employeeSearch: "", selectedEmployees: new Set() })}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      disabled={assignModal.selectedEmployees.size === 0}
                      onClick={() => handleAssignMultiple(assignModal.issueId)}
                      className="px-6 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      Assign {assignModal.selectedEmployees.size > 0 && `(${assignModal.selectedEmployees.size})`}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* IMAGE MODAL */}
        {showImage && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex items-center justify-center p-4" onClick={() => setShowImage(false)}>
            <div className="max-w-4xl max-h-full" onClick={e => e.stopPropagation()}>
              <img 
                src={`http://localhost:5000/uploads/${project.image}`} 
                className="w-full h-auto max-h-[90vh] rounded-2xl shadow-2xl"
                alt={project.name}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
