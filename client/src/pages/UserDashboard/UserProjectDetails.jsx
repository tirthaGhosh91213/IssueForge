import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './NavBar';
import IssueTable from './IssueTable'; // Import the new component
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
  const [error, setError] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    fetchProjectAndIssues();
  }, [projectId]);

  const fetchProjectAndIssues = async () => {
    try {
      setLoading(true);
      const projRes = await fetch(`http://localhost:5000/api/admin/project/${projectId}`);
      const projData = await projRes.json();
      
      if (projData.success) {
        setProject(projData.project);
        // Assuming your backend has an endpoint for project-specific issues
        const issueRes = await fetch(`http://localhost:5000/api/user/issues/${projectId}`);
        const issueData = await issueRes.json();
        if (issueData.success) setIssues(issueData.issues);
      } else {
        setError('Project details are currently unavailable.');
      }
    } catch (err) {
      setError('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-slate-500 font-medium">Loading project environment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* FULL SCREEN LIGHTBOX */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl transition-all duration-300">
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all border border-white/20"
          >
            <XMarkIcon className="w-8 h-8" />
          </button>
          <img
            src={`http://localhost:5000/uploads/${project.image}`}
            alt={project.name}
            className="max-w-[90%] max-h-[85vh] rounded-xl shadow-2xl object-contain border border-white/10"
          />
        </div>
      )}

      {/* STICKY HEADER */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/user')}
            className="group flex items-center text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate(`/user/create-issue?projectId=${project._id}`)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-md active:scale-95"
          >
            <PlusIcon className="w-4 h-4" />
            New Issue
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-10 px-6 lg:px-8 space-y-10">
        
        {/* TOP SECTION: IMAGE AND DESCRIPTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div 
                className="relative h-[400px] w-full bg-slate-100 cursor-zoom-in group"
                onClick={() => setIsLightboxOpen(true)}
              >
                <img
                  src={`http://localhost:5000/uploads/${project.image}`}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                  <span className="text-white text-sm font-bold flex items-center gap-2">
                    <PlusIcon className="w-5 h-5" /> Click to View Full Resolution
                  </span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                    <DocumentTextIcon className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">{project.name}</h1>
                </div>
                <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              </div>
            </div>
          </div>

          {/* PROJECT METADATA CARD */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Metadata</h3>
              <div className="space-y-8">
                <div className="flex items-center gap-5">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <CalendarIcon className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Registration Date</p>
                    <p className="text-md font-bold text-slate-900">{new Date(project.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <CodeBracketIcon className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Version Control</p>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group w-full px-4 py-2.5 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl transition-all">
                      GitHub Repository <LinkIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEPARATE ISSUES COMPONENT */}
        <IssueTable issues={issues} />
      </main>
    </div>
  );
};

export default UserProjectDetails;