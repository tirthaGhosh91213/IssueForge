import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Folder,
  Loader2,
  Eye,
  Plus,
  Pencil,
  Trash2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    if (!window.confirm("Delete this project?")) return;

    await fetch(`http://localhost:5000/api/admin/project/${id}`, {
      method: "DELETE",
    });

    setProjects((prev) => prev.filter((p) => p._id !== id));
  };

  // -------------------------
  // SEARCH FILTER
  // -------------------------
  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // -------------------------
  // LOADING
  // -------------------------
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin w-12 h-12 text-indigo-600" />
      </div>
    );
  }

  // -------------------------
  // UI
  // -------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8 space-y-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Folder className="w-7 h-7 text-indigo-600" />
          All Projects
        </h1>

        {/* SEARCH */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-3 w-full rounded-xl border bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* PROJECT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {filteredProjects.length === 0 && (
          <p className="text-gray-400">No projects found</p>
        )}

        {filteredProjects.map((project, index) => (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ y: -6, scale: 1.01 }}
            onClick={() => navigate(`/admin/project/${project._id}`)} // 🔥 whole card clickable
            className="cursor-pointer bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-100 p-6 space-y-4"
          >
            {/* IMAGE */}
            <img
              src={`http://localhost:5000/uploads/${project.image}`}
              alt=""
              className="h-48 w-full object-cover rounded-2xl"
            />

            {/* INFO */}
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {project.name}
              </h3>

              <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                {project.description}
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap gap-3 pt-3">

              {/* CREATE ISSUE */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/admin/issues/create/${project._id}`);
                }}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:scale-105 transition"
              >
                <Plus size={15} />
                Issue
              </button>

              {/* VIEW ISSUES */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/admin/project/${project._id}/issues`);
                }}
                className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl hover:scale-105 transition"
              >
                <Eye size={15} />
                Issues
              </button>

              {/* EDIT */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/admin/project/edit/${project._id}`);
                }}
                className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-xl hover:scale-105 transition"
              >
                <Pencil size={15} />
                Edit
              </button>

              {/* DELETE */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(project._id);
                }}
                className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-xl hover:scale-105 transition"
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
