import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Github, ArrowLeft, X } from "lucide-react"; // ✅ Github added
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProjectHeader({ project, id, onDeleteProject }) {
  const navigate = useNavigate();
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showImage, setShowImage] = useState(false);

  const words = project.description?.split(" ") || [];
  const desc = words.length > 30 && !showFullDesc
    ? words.slice(0, 30).join(" ") + "…"
    : project.description;

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
              <img
                src={`http://localhost:5000/uploads/${project.image}`}
                onClick={() => setShowImage(true)}
                className="w-64 h-48 lg:w-80 lg:h-56 object-cover rounded-xl border-4 border-gray-200 shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
                alt={project.name}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>

            {/* Project Details + Buttons */}
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {project.name}
              </h1>
              <p className="mt-3 text-sm text-gray-500">Project Management Dashboard</p>
              
              {/* Description */}
              <div className="prose prose-lg max-w-none mb-8">
                <p className="text-gray-700 leading-relaxed">
                  {desc}
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

              {/* 🎯 ACTION BUTTONS WITH GITHUB */}
              <div className="flex flex-wrap gap-3">
                {/* New Issue */}
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate(`/admin/issues/create/${id}`)} 
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  New Issue
                </motion.button>

                {/* Edit Project */}
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate(`/admin/project/edit/${id}`)} 
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Pencil className="w-5 h-5 mr-2" />
                  Edit Project
                </motion.button>

                {/* Delete Project */}
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  onClick={onDeleteProject} 
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Delete
                </motion.button>

                {/* 🎯 GITHUB BUTTON - CONDITIONAL */}
                {project.githubUrl && (
                  <motion.a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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

      {/* Image Modal */}
      {showImage && (
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
              src={`http://localhost:5000/uploads/${project.image}`} 
              className="w-full h-auto max-h-[90vh] max-w-full object-contain p-4"
              alt={project.name}
            />
          </motion.div>
        </div>
      )}
    </>
  );
}
