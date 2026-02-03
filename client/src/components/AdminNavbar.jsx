import { motion } from "framer-motion";
import { Users, FolderKanban, Bug, Plus, Shield, LogOut, UserPlus } from "lucide-react";

export default function AdminNavbar({ active, setActive, navigate }) {
  const tabs = [
    { key: "users", label: "Users", icon: Users },
    { key: "projects", label: "Projects", icon: FolderKanban },
    { key: "issues", label: "Issues", icon: Bug }
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="bg-white shadow-lg border-b border-gray-200 px-8 py-6 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-2xl font-bold text-white">IF</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">IssueForge</h1>
            <p className="text-xs text-gray-500 font-medium">Admin Panel</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.key}
                layout
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActive(tab.key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                  active === tab.key
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-white hover:text-gray-900 hover:shadow-sm"
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Actions - Clean and Minimal */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/admin/create-project")}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 shadow-sm transition-all duration-200"
          >
            <Plus size={16} />
            New
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              localStorage.removeItem("auth");
              navigate("/login");
            }}
            className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <LogOut size={18} />
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
