import { useEffect, useState, useCallback } from "react";
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
    success: false
  });
  const [isAssigning, setIsAssigning] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, type: '', id: null });
  const [loading, setLoading] = useState(false); // ✅ Global loading state

  // ✅ AUTO REFRESH FUNCTIONS
  const refreshProject = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/project/${id}`);
      const data = await response.json();
      setProject(data.project);
    } catch (error) {
      console.error('Error refreshing project:', error);
    }
  }, [id]);

  const refreshIssues = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/issues/project/${id}`);
      const data = await response.json();
      if (data.success) {
        setIssues(data.issues || []);
      }
    } catch (error) {
      console.error('Error refreshing issues:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const refreshEmployees = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/users");
      const data = await response.json();
      setEmployees(data.users || []);
    } catch (error) {
      console.error('Error refreshing employees:', error);
    }
  }, []);

  // ✅ MAIN REFRESH FUNCTION - Calls ALL refreshes
  const refreshAllData = useCallback(async () => {
    setLoading(true);
    await Promise.allSettled([
      refreshProject(),
      refreshIssues(),
      refreshEmployees()
    ]);
    setLoading(false);
  }, [refreshProject, refreshIssues, refreshEmployees]);

  // Initial load
  useEffect(() => {
    refreshAllData();
  }, [id, refreshAllData]);

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
      success: false
    });
  };

  // ✅ FIXED: handleAssignMultiple with AUTO REFRESH
  const handleAssignMultiple = async (issueId) => {
    const adminId = getAdminId();
    const userIds = Array.from(assignModal.selectedEmployees);

    if (userIds.length === 0) return;

    setIsAssigning(true);

    try {
      await fetch(`http://localhost:5000/api/issues/assign/${issueId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId, userIds })
      });

      // ✅ AUTO REFRESH AFTER SUCCESS
      await refreshAllData();

      // Show success popup
      setAssignModal(prev => ({
        ...prev,
        success: true
      }));

      setTimeout(() => {
        closeAssignModal();
      }, 2000);

    } catch (error) {
      console.error('Assign error:', error);
    } finally {
      setIsAssigning(false);
    }
  };

  // ================= DELETE LOGIC =================
  const confirmDeleteProject = () => setDeleteConfirm({ open: true, type: 'project', id });
  const confirmDeleteIssue = (issueId) => setDeleteConfirm({ open: true, type: 'issue', id: issueId });

  // ✅ FIXED: handleDeleteConfirmed with AUTO REFRESH
  const handleDeleteConfirmed = async () => {
    try {
      if (deleteConfirm.type === 'project') {
        await fetch(`http://localhost:5000/api/admin/project/${deleteConfirm.id}`, { method: "DELETE" });
        navigate(-1);
      } else {
        await fetch(`http://localhost:5000/api/issues/${deleteConfirm.id}`, { method: "DELETE" });
        // ✅ AUTO REFRESH AFTER ISSUE DELETE
        await refreshAllData();
      }
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setDeleteConfirm({ open: false, type: '', id: null });
    }
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

  // ✅ MANUAL REFRESH BUTTON HANDLER
  const handleManualRefresh = async () => {
    await refreshAllData();
  };

  // Loading
  if (!project && !loading) {
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
        
        {/* 🎯 REFRESH BUTTON - TOP RIGHT */}

        {/* 🎯 ALL COMPONENTS CONNECTED */}
        <ProjectHeader 
          project={project} 
          id={id} 
          onDeleteProject={confirmDeleteProject} 
        />

        {/* ✅ PASS refreshIssues to IssuesSection */}
        <IssuesSection 
          filteredIssues={filteredIssues}
          search={search}
          onSearchChange={setSearch}
          onAssignClick={(modalData) => setAssignModal({ 
            ...modalData, 
            open: true 
          })}
          onEditIssue={handleEditIssue}
          onDeleteIssue={confirmDeleteIssue}
          refreshIssues={refreshAllData}  // ✅ AUTO REFRESH PROP
          loading={loading}
          adminId={getAdminId()}
        />

        <AssignModal 
          assignModal={assignModal}
          filteredEmployees={filteredEmployees}
          onClose={closeAssignModal}
          onEmployeeSearchChange={(e) => setAssignModal(prev => ({ ...prev, employeeSearch: e.target.value }))}
          onToggleEmployee={toggleEmployee}
           issueId={assignModal.issueId}           // ✅ NEW
  currentIssue={issues.find(issue => issue._id === assignModal.issueId)} 
          onAssign={() => handleAssignMultiple(assignModal.issueId)}
          isAssigning={isAssigning}
          onSuccessClose={closeAssignModal}
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
