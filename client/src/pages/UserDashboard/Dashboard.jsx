import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './NavBar';
import { 
  MagnifyingGlassIcon, 
  EyeIcon, 
  PlusIcon,
  CodeBracketIcon,
  CalendarIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/admin/projects');
      const data = await response.json();
      
      if (data.success) {
        setProjects(data.projects);
      } else {
        setError('Failed to fetch projects');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Memoized search logic for performance
  const filteredProjects = useMemo(() => {
    return projects.filter(project => 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, projects]);

  const handleCreateIssue = (projectId) => {
    navigate(`/user/create-issue?projectId=${projectId}`);
  };

  const handleViewDetails = (projectId) => {
    navigate(`/user/project/${projectId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-slate-500 font-medium">Loading Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Formal Header Section */}
        <div className="border-b border-slate-200 pb-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Projects Dashboard
              </h1>
              <p className="mt-2 text-slate-600 text-lg">
                Overview of active assignments and issue tracking.
              </p>
            </div>

            {/* Functional Search Bar */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg bg-white shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
              />
            </div>
          </div>
        </div>

        {/* Status Message for Search */}
        {searchQuery && (
          <div className="mb-6 text-sm text-slate-500">
            Showing {filteredProjects.length} results for "<span className="font-semibold">{searchQuery}</span>"
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onCreateIssue={() => handleCreateIssue(project._id)}
              onViewDetails={() => handleViewDetails(project._id)}
            />
          ))}
        </div>

        {/* Formal Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <ExclamationCircleIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900">No projects found</h3>
            <p className="text-slate-500 mt-1">Try adjusting your search or check back later.</p>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="mt-4 text-indigo-600 font-medium hover:text-indigo-500"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ProjectCard = ({ project, onCreateIssue, onViewDetails }) => {
  return (
    <div className="flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-300 overflow-hidden">
      {/* Thumbnail */}
      <div className="relative h-44 bg-slate-100 group cursor-pointer" onClick={onViewDetails}>
        <img
          src={`http://localhost:5000/uploads/${project.image}`}
          alt={project.name}
          className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x200?text=No+Preview+Available";
          }}
        />
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm">
            Active
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-slate-900 mb-2 truncate">
          {project.name}
        </h3>
        
        <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-2 italic">
          {project.description || "No description provided for this project."}
        </p>

        {/* Metadata Links */}
        <div className="mt-auto space-y-3">
          <div className="flex items-center text-xs font-medium text-slate-500">
            <CodeBracketIcon className="w-4 h-4 mr-2 text-slate-400" />
            <a 
              href={project.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-indigo-600 hover:text-indigo-800 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Source Repository
            </a>
          </div>
          <div className="flex items-center text-xs font-medium text-slate-500">
            <CalendarIcon className="w-4 h-4 mr-2 text-slate-400" />
            <span>Last Updated: {new Date(project.updatedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
          </div>
        </div>

        {/* Action Row */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
          >
            <EyeIcon className="w-4 h-4" />
            View
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCreateIssue();
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
          >
            <PlusIcon className="w-4 h-4" />
            Issue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;