// AdminDashboard.jsx - HYBRID TAB + ROUTE
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AdminNavbar from "../components/AdminNavbar";
import { 
  Users, 
  Folder, 
  ChevronLeft, 
  ChevronRight,
  Loader2 
} from "lucide-react";
import AllUsers from "../components/AllUsers";
import AllProjects from "../components/AllProjects";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Handle Users Tab (stay on dashboard)
  const handleUsersClick = () => {
    setActiveTab("users");
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  // Handle Projects Click (redirect to /admin/projects)
  const handleProjectsClick = () => {
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
    navigate("/admin/projects");
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-white">
      <AdminNavbar navigate={navigate} />
      
      <div className="h-[calc(100vh-80px)] flex">
        {/* Simple Formal White Sidebar */}
        <div className={`flex-shrink-0 transition-all duration-500 shadow-lg border-r border-gray-200 ${
          window.innerWidth >= 1024 ? 'w-64' : isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
        }`}>
          <div className="h-full flex flex-col bg-white">
            {/* Clean Header */}
            <div className="p-8 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                Admin Panel
              </h1>
            </div>

            {/* Navigation - Simple & Formal */}
            <nav className="flex-1 p-4 space-y-2">
              {/* Users - TAB */}
              <motion.button
                onClick={handleUsersClick}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 group ${
                  activeTab === "users"
                    ? "bg-blue-50 border-2 border-blue-200 text-blue-800 shadow-sm font-semibold"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-gray-200"
                }`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`w-11 h-11 rounded-lg flex items-center justify-center transition-all ${
                  activeTab === "users" ? "bg-blue-200" : "bg-gray-100 group-hover:bg-blue-50"
                }`}>
                  <Users className={`w-5 h-5 ${activeTab === "users" ? "text-blue-700" : "text-gray-500 group-hover:text-blue-600"}`} />
                </div>
                <span className="text-left font-medium">All Users</span>
              </motion.button>

              {/* Projects - ROUTE TO /admin/projects */}
              <motion.button
                onClick={handleProjectsClick}
                className="w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 group border border-gray-200 hover:bg-indigo-50 hover:text-indigo-900 hover:border-indigo-200 hover:shadow-md"
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-11 h-11 bg-gray-100 group-hover:bg-indigo-50 rounded-lg flex items-center justify-center transition-all">
                  <Folder className="w-5 h-5 text-gray-500 group-hover:text-indigo-600 transition-all" />
                </div>
                <span className="text-left font-medium">All Projects</span>
              </motion.button>
            </nav>

            {/* Mobile Toggle */}
            <div className="p-4 border-t border-gray-200 lg:hidden">
              <motion.button
                className="w-full p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all text-sm font-medium text-gray-700 flex items-center justify-center gap-2"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                <span>{isSidebarOpen ? "Close" : "Open Menu"}</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Main Content - ONLY SHOWS USERS TAB */}
        <div className="flex-1 overflow-hidden bg-white">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-full flex flex-col items-center justify-center p-12"
              >
                <motion.div 
                  className="w-20 h-20 border-4 border-gray-200 border-t-blue-500 rounded-xl mb-8 shadow-lg"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Loading Dashboard</h2>
                <p className="text-lg text-gray-600">Please wait while we prepare your data</p>
              </motion.div>
            ) : (
              <motion.div
                key="users"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, type: "spring" }}
                className="h-full overflow-y-auto p-8"
              >
                {/* ONLY SHOW AllUsers - Projects goes to separate page */}
                <AllUsers />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
