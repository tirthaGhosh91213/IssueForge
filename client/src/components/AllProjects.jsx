import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import {
  Search,
  Folder,
  Loader2,
  Eye,
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  Users,
} from "lucide-react";

export default function AllProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // -------------------------
  // FETCH PROJECTS
  // -------------------------
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/projects");
      const data = await res.json();
      setProjects(data.projects || []);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // DELETE PROJECT
  // -------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project permanently?")) return;

    try {
      await fetch(`http://localhost:5000/api/admin/project/${id}`, {
        method: "DELETE",
      });
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // -------------------------
  // SEARCH FILTER
  // -------------------------
  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  // -------------------------
  // LOADING
  // -------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Admin Navbar */}
      <AdminNavbar navigate={navigate} />

      <div className="flex  min-h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="flex-shrink-0 pt-40 w-64 h-screen bg-white shadow-lg border-r border-gray-200 fixed left-0 top-0 z-40 lg:z-auto">
          <div className="h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-[18px] font-bold text-gray-900">
                Admin Panel
              </h2>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar mt-px">
              <motion.button
                onClick={() => navigate("/admin")}
                className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 border border-gray-200 hover:border-blue-200 transition-all text-sm font-medium text-gray-700 hover:text-blue-700"
                whileHover={{ x: 2 }}
              >
                <Users className="w-5 h-5" />
                Users
              </motion.button>

              <motion.button
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-indigo-50 border-2 border-indigo-200 text-indigo-800 font-semibold shadow-sm mt-2"
                whileHover={{ x: 2 }}
              >
                <Folder className="w-5 h-5" />
                All Projects
              </motion.button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-60 overflow-y-auto p-6 lg:p-12 space-y-12">
          {/* HEADER SECTION */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">
              {/* Title */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <Folder className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl lg:text-2xl font-black bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                    All Projects
                  </h1>
                  <p className="text-[17px] text-gray-600 mt-1 font-medium">
                    {projects.length} project{projects.length !== 1 ? "s" : ""}{" "}
                    total
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/admin/project/issues")}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-2xl font-semibold shadow-xl hover:shadow-2xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-3 text-[17px]"
                >
                  <Users className="w-5 h-5" />
                  All Issues
                </motion.button>
              </div>
            </div>

            {/* Search */}
            <div className="max-w-md mx-auto lg:ml-auto">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search projects by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm shadow-lg focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50 focus:outline-none transition-all duration-300 text-lg placeholder-gray-500"
                />
              </div>
            </div>
          </motion.div>

          {/* PROJECTS GRID */}
          <div className="max-w-7xl mx-auto">
            {filteredProjects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-32"
              >
                <AlertCircle className="w-24 h-24 text-gray-300 mx-auto mb-8" />
                <h3 className="text-3xl font-bold text-gray-500 mb-4">
                  {search ? "No matching projects" : "No projects yet"}
                </h3>
                <p className="text-xl text-gray-400 mb-8 max-w-md mx-auto">
                  {search
                    ? "Try different search terms"
                    : "Get started by creating your first project"}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate("/admin/projects/create")}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-lg"
                >
                  Create First Project
                </motion.button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{
                      y: -12,
                      scale: 1.02,
                      boxShadow: "0 35px 60px -20px rgba(0, 0, 0, 0.15)",
                    }}
                    className="group bg-gradient-to-br from-white to-indigo-50/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 hover:border-indigo-200/50 p-8 cursor-pointer overflow-hidden relative"
                    onClick={() => navigate(`/admin/project/${project._id}`)}
                  >
                    {/* Image with overlay */}
                    <div className="relative mb-6 overflow-hidden rounded-2xl h-56 group-hover:brightness-105 transition-all duration-500">
                      <img
                        src={`http://localhost:5000/uploads/${project.image}`}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/400x240/6b7280/ffffff?text=No+Image";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <p className="text-white text-sm font-medium bg-black/40 backdrop-blur-sm px-3 py-1 rounded-xl truncate">
                          View Details →
                        </p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-black text-gray-900 group-hover:text-indigo-900 transition-colors line-clamp-2 leading-tight">
                        {project.name}
                      </h3>

                      <p className="text-gray-600 leading-relaxed line-clamp-3 h-16">
                        {project.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-indigo-600 font-semibold flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          View Project
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-100">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/issues/create/${project._id}`);
                        }}
                        className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-teal-700 transition-all text-sm flex-1 min-w-[100px]"
                      >
                        <Plus className="w-4 h-4" />
                        New Issue
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/project/edit/${project._id}`);
                        }}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-700 transition-all text-sm"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(project._id);
                        }}
                        className="flex items-center gap-2  px-5 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl border-gray-200 bg-gray-50 text-gray-500 hover:text-red-500  hover:bg-red-100 hover:border-red-300  transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </motion.button>
                    </div>

                    {/* Hover glow effect */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
