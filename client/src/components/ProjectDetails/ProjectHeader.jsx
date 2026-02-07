import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Github, ArrowLeft, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProjectHeader({ project, id, onDeleteProject }) {
  const navigate = useNavigate();
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // ✅ NULL SAFETY - Safe project data access
  const safeProject = project || {};
  const safeName = safeProject.name || "Loading Project...";
  const safeDescription = safeProject.description || "No description available.";
  const safeImage = safeProject.image || null;
  const safeGithubUrl = safeProject.githubUrl || null;

  // ✅ Safe description truncation
  const words = safeDescription.split(" ");
  const desc = words.length > 30 && !showFullDesc
    ? words.slice(0, 30).join(" ") + "…"
    : safeDescription;

  // Early return if no project data at all
  if (!safeProject._id && !id) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm mb-12 overflow-hidden p-12 text-center">
        <Loader2 className="w-16 h-16 text-gray-400 animate-spin mx-auto mb-6" />
        <p className="text-xl text-gray-600 font-medium">Loading project header...</p>
      </div>
    );
  }

  return (
    <>
      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate(-1)}
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Projects
      </motion.button>

      {/* Project Header */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-200 rounded-2xl shadow-sm mb-12 overflow-hidden"
      >
        <div className="p-8 lg:p-12">
          <div className="lg:flex lg:items-start lg:gap-10">
            {/* Project Image */}
            <div className="flex-shrink-0 mb-8 lg:mb-0">
              {safeImage ? (
                <>
                  <div className={`w-64 h-48 lg:w-80 lg:h-56 rounded-xl border-4 border-gray-200 shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 relative ${imageLoading ? 'bg-gray-100 animate-pulse' : ''}`}>
                    <img
                      src={`http://localhost:5000/uploads/${safeImage}`}
                      onLoad={() => setImageLoading(false)}
                      onClick={() => setShowImage(true)}
                      className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                      alt={safeName}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        setImageLoading(false);
                      }}
                    />
                  </div>
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                    </div>
                  )}
                </>
              ) : (
                <div className="w-64 h-48 lg:w-80 lg:h-56 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl border-4 border-dashed border-gray-300 flex items-center justify-center shadow-md">
                  <span className="text-gray-400 text-lg font-medium">No Image</span>
                </div>
              )}
            </div>

            {/* Project Details + Buttons */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight truncate">
                {safeName}
              </h1>
              <p className="mt-3 text-sm text-gray-500">Project Management Dashboard</p>
              
              {/* Description */}
              <div className="prose prose-lg max-w-none mb-8 mt-4">
                <p className="text-gray-700 leading-relaxed">
                  {desc}
                  {words.length > 30 && (
                    <button 
                      onClick={() => setShowFullDesc(!showFullDesc)} 
                      className="ml-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm underline hover:no-underline focus:outline-none"
                    >
                      {showFullDesc ? "Show less" : "Read more"}
                    </button>
                  )}
                </p>
              </div>

              {/* 🎯 ACTION BUTTONS WITH GITHUB */}
              <div className="flex flex-wrap gap-3">
                {/* New Issue */}
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate(`/admin/issues/create/${id}`)} 
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  New Issue
                </motion.button>

                {/* Edit Project */}
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate(`/admin/project/edit/${id}`)} 
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                >
                  <Pencil className="w-5 h-5 mr-2" />
                  Edit Project
                </motion.button>

                {/* Delete Project */}
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  onClick={onDeleteProject || (() => {})} 
                  className="inline-flex items-center px-6 py-3 border border-red-300 text-base font-medium rounded-lg shadow-sm text-red-700 bg-red-50 hover:bg-red-100 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Delete
                </motion.button>

                {/* 🎯 GITHUB BUTTON - FULLY SAFE */}
                {safeGithubUrl && (
                  <motion.a 
                    href={safeGithubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                  >
                    <Github className="w-5 h-5 mr-2" />
                    View GitHub
                  </motion.a>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Image Modal - FULLY SAFE */}
      {showImage && safeImage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex items-center justify-center p-6" onClick={() => setShowImage(false)}>
          <motion.div 
            initial={{ scale: 0.9 }} 
            animate={{ scale: 1 }} 
            className="max-w-4xl max-h-full bg-white rounded-2xl shadow-2xl overflow-hidden relative max-w-[95vw] max-h-[95vh]" 
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowImage(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-xl shadow-lg border border-gray-200 transition-all duration-200 hover:scale-105"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
            <img 
              src={`http://localhost:5000/uploads/${safeImage}`} 
              className="w-full h-auto max-h-[90vh] max-w-full object-contain p-4"
              alt={safeName}
              onError={(e) => {
                e.target.style.display = 'none';
                setShowImage(false);
              }}
            />
          </motion.div>
        </div>
      )}
    </>
  );
}
