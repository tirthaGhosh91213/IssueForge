import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './NavBar';
import IssueTable from './IssueTable'; // Importing the child component
import { 
  ArrowLeftIcon, 
  LinkIcon,
  CalendarIcon,
  PlusIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const UserProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Fetching both APIs simultaneously
        const [projRes, issueRes] = await Promise.all([
          fetch(`http://localhost:5000/api/admin/project/${projectId}`),
          fetch(`http://localhost:5000/api/issues/project/${projectId}`)
        ]);

        const projData = await projRes.json();
        const issueData = await issueRes.json();

        if (projData.success) setProject(projData.project);
        if (issueData.success) setIssues(issueData.issues);
        
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [projectId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* LIGHTBOX */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl">
          <button onClick={() => setIsLightboxOpen(false)} className="absolute top-8 right-8 text-white">
            <XMarkIcon className="w-8 h-8" />
          </button>
          <img src={`http://localhost:5000/uploads/${project?.image}`} className="max-w-[90%] max-h-[85vh] rounded-xl shadow-2xl" alt="" />
        </div>
      )}

      {/* HEADER */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-6 h-16 flex items-center justify-between">
        <button onClick={() => navigate('/user')} className="flex items-center text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
          <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Dashboard
        </button>
        <button onClick={() => navigate(`/user/create-issue?projectId=${projectId}`)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-md">
          <PlusIcon className="w-4 h-4 inline mr-1" /> New Issue
        </button>
      </div>

      <main className="max-w-7xl mx-auto py-10 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* PROJECT INFO */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="h-[400px] cursor-zoom-in" onClick={() => setIsLightboxOpen(true)}>
              <img src={`http://localhost:5000/uploads/${project?.image}`} className="w-full h-full object-cover" alt={project?.name} />
            </div>
            <div className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-indigo-600 rounded-xl text-white"><DocumentTextIcon className="w-6 h-6" /></div>
                <h1 className="text-3xl font-black text-slate-900">{project?.name}</h1>
              </div>
              <p className="text-slate-600 leading-relaxed">{project?.description}</p>
            </div>
          </div>

          {/* METADATA */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm h-fit">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Details</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <CalendarIcon className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Created</p>
                  <p className="text-sm font-bold">{new Date(project?.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <a href={project?.githubUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between w-full p-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm">
                Repository <LinkIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* ISSUES SECTION */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900">Active Issues</h2>
          <span className="bg-white px-3 py-1 rounded-full border text-xs font-bold text-slate-500">{issues.length} Total</span>
        </div>
        
        {/* CONNECTION: Passing issues state to the child component */}
        <IssueTable issues={issues} />
      </main>
    </div>
  );
};

export default UserProjectDetails;