import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

// Components
import ProjectHeader from "../components/ProjectDetails/ProjectHeader";
import IssuesSection from "../components/ProjectDetails/IssuesSection";
import AssignModal from "../components/ProjectDetails/AssignModal";
import DeleteConfirmModal from "../components/ProjectDetails/DeleteConfirmModal";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const getAdminId = () => localStorage.getItem('adminId') || '697f7455a657114b9d853f92';

  // State
  const [project, setProject] = useState(null);
  const [issues, setIssues] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [assignModal, setAssignModal] = useState({ 
    open: false, 
    issueId: null,
    employeeSearch: "",
    selectedEmployees: new Set(),
    success: false  // ✅ Added for success popup
  });
  const [isAssigning, setIsAssigning] = useState(false);  // ✅ Loading state
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, type: '', id: null });

  // ================= FETCH DATA =================
  useEffect(() => {
    fetch(`http://localhost:5000/api/admin/project/${id}`)
      .then(r => r.json())
      .then(d => setProject(d.project));

    fetchIssues();
    fetchEmployees();  // ✅ Fixed: Now called
  }, [id]);

  const fetchIssues = () => {
    fetch(`http://localhost:5000/api/issues/project/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setIssues(d.issues || []);
      })
      .catch(err => console.error('Error fetching issues:', err));
  };

  const fetchEmployees = () => {
    fetch("http://localhost:5000/api/admin/users")
      .then(r => r.json())
      .then(d => setEmployees(d.users || []));
  };

  // ================= ASSIGN LOGIC =================
  const toggleEmployee = (empId) => {
    const set = new Set(assignModal.selectedEmployees);
    set.has(empId) ? set.delete(empId) : set.add(empId);
    setAssignModal(prev => ({ ...prev, selectedEmployees: set }));
  };

  const closeAssignModal = () => {
    setAssignModal({ 
      open: false, 
      issueId: null, 
      employeeSearch: "", 
      selectedEmployees: new Set(),
      success: false  // ✅ Reset success
    });
  };

  // ✅ SINGLE & CORRECT handleAssignMultiple
  const handleAssignMultiple = async (issueId) => {
    const adminId = getAdminId();
    const userIds = Array.from(assignModal.selectedEmployees);

    if (userIds.length === 0) return;

    setIsAssigning(true); // ✅ Spinner ON

    try {
      await fetch(`http://localhost:5000/api/issues/assign/${issueId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId, userIds })
      });

      // ✅ SUCCESS: Show success popup
      setAssignModal(prev => ({
        ...prev,
        success: true  // ✅ Trigger success popup
      }));

      setTimeout(() => {
        closeAssignModal();
        fetchIssues();
      }, 2000); // Auto close after 2s

    } catch (error) {
      console.error('Assign error:', error);
    } finally {
      setIsAssigning(false); // ✅ Spinner OFF
    }
  };

  // ================= DELETE LOGIC =================
  const confirmDeleteProject = () => setDeleteConfirm({ open: true, type: 'project', id });
  const confirmDeleteIssue = (issueId) => setDeleteConfirm({ open: true, type: 'issue', id: issueId });

  const handleDeleteConfirmed = async () => {
    if (deleteConfirm.type === 'project') {
      await fetch(`http://localhost:5000/api/admin/project/${deleteConfirm.id}`, { method: "DELETE" });
      navigate(-1);
    } else {
      await fetch(`http://localhost:5000/api/issues/${deleteConfirm.id}`, { method: "DELETE" });
      fetchIssues();
    }
    setDeleteConfirm({ open: false, type: '', id: null });
  };

  const handleEditIssue = (issueId) => {
    navigate(`/admin/issues/edit/${issueId}`);
  };

  // Filters
  const filteredIssues = issues.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase())
  );

  const filteredEmployees = assignModal.open 
    ? employees.filter(emp => 
        emp.name.toLowerCase().includes(assignModal.employeeSearch.toLowerCase()) ||
        emp.email.toLowerCase().includes(assignModal.employeeSearch.toLowerCase())
      )
    : employees;

  // Loading
  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-12">
          <Loader2 className="w-16 h-16 text-gray-400 animate-spin mx-auto mb-6" />
          <p className="text-xl text-gray-600 font-medium">Loading project details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 🎯 ALL COMPONENTS CONNECTED */}
        <ProjectHeader 
          project={project} 
          id={id} 
          onDeleteProject={confirmDeleteProject} 
        />

        {/* ✅ FIXED: Correct onAssignClick prop */}
        <IssuesSection 
          filteredIssues={filteredIssues}
          search={search}
          onSearchChange={setSearch}
          onAssignClick={(modalData) => setAssignModal({ 
            ...modalData, 
            open: true 
          })}  // ✅ Fixed: Pass full modal data
          onEditIssue={handleEditIssue}
          onDeleteIssue={confirmDeleteIssue}
        />

        <AssignModal 
          assignModal={assignModal}
          filteredEmployees={filteredEmployees}
          onClose={closeAssignModal}
          onEmployeeSearchChange={(e) => setAssignModal(prev => ({ ...prev, employeeSearch: e.target.value }))}
          onToggleEmployee={toggleEmployee}
          onAssign={() => handleAssignMultiple(assignModal.issueId)}
          isAssigning={isAssigning}           // ✅ Spinner support
          onSuccessClose={closeAssignModal}   // ✅ Success popup
        />

        <DeleteConfirmModal 
          deleteConfirm={deleteConfirm}
          onCancel={() => setDeleteConfirm({ open: false, type: '', id: null })}
          onConfirm={handleDeleteConfirmed}
        />

      </div>
    </div>
  );
}
