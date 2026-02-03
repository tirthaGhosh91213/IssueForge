// AllProjects.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Folder, Image as ImageIcon, Eye, Download, Loader2 } from "lucide-react";

export default function AllProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/admin/projects");
        const data = await response.json();
        setProjects(data.projects || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-12"
      >
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-6" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Loading Projects...</h2>
          <p className="text-slate-600">Fetching all project data</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
          <Folder className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-800">All Projects</h2>
          <p className="text-slate-600">Manage and monitor your projects</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {projects.length === 0 ? (
          <div className="col-span-full text-center py-20 text-slate-500">
            No projects found
          </div>
        ) : (
          projects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group bg-gradient-to-br from-white via-slate-50 to-blue-50 rounded-3xl p-8 shadow-xl border border-slate-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-500 overflow-hidden relative"
            >
              <div className="relative mb-6">
                <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl overflow-hidden group-hover:scale-105 transition-transform duration-500 relative">
                  {project.image ? (
                    <img
                      src={`http://localhost:5000/uploads/${project.image}`}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:brightness-105 transition-all duration-500"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                      <button className="p-3 bg-white/90 backdrop-blur-sm rounded-2xl hover:bg-white shadow-lg transition-all hover:scale-110">
                        <Eye className="w-5 h-5 text-slate-700" />
                      </button>
                      <button className="p-3 bg-white/90 backdrop-blur-sm rounded-2xl hover:bg-white shadow-lg transition-all hover:scale-110">
                        <Download className="w-5 h-5 text-slate-700" />
                      </button>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                    <ImageIcon className="w-24 h-24 text-slate-400" />
                  </div>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {project.name}
              </h3>
              <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed">{project.description || "No description available"}</p>
              
              <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                <span className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold rounded-xl shadow-lg">
                  Active
                </span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-2xl hover:scale-110 transition-all shadow-md hover:shadow-lg">
                    Edit
                  </button>
                  <button className="p-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-2xl hover:scale-110 transition-all shadow-md hover:shadow-lg">
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
