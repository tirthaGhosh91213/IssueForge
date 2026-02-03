import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AdminNavbar from "../components/AdminNavbar";
import { Users, FolderKanban, Bug, UserCheck, Shield } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState("users");
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersRes, projectsRes, issuesRes] = await Promise.all([
          fetch("http://localhost:5000/api/admin/users").then(r => r.json()),
          fetch("http://localhost:5000/api/admin/projects").then(r => r.json()),
          fetch("http://localhost:5000/api/issues?page=1&limit=5").then(r => r.json())
        ]);
        setUsers(usersRes.users || []);
        setProjects(projectsRes.projects || []);
        setIssues(issuesRes.issues || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar active={active} setActive={setActive} navigate={navigate} />
      
      <div className="max-w-7xl mx-auto px-8 py-12">
        <AnimatePresence mode="wait">
          {active === "users" && <UsersSection users={users} />}
          {active === "projects" && <ProjectsSection projects={projects} />}
          {active === "issues" && <IssuesSection issues={issues} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

function UsersSection({ users }) {
  return (
    <motion.section
      key="users"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <PageHeader title="Users Management" count={users.length} icon={Users} />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user, i) => (
          <UserCard key={user._id} user={user} delay={i * 0.05} />
        ))}
      </div>
    </motion.section>
  );
}

function ProjectsSection({ projects }) {
  return (
    <motion.section
      key="projects"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <PageHeader title="Projects Overview" count={projects.length} icon={FolderKanban} />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, i) => (
          <ProjectCard key={project._id} project={project} delay={i * 0.05} />
        ))}
      </div>
    </motion.section>
  );
}

function IssuesSection({ issues }) {
  return (
    <motion.section
      key="issues"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <PageHeader title="Issue Tracker" count={issues.length} icon={Bug} />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {issues.map((issue, i) => (
          <IssueCard key={issue._id} issue={issue} delay={i * 0.05} />
        ))}
      </div>
    </motion.section>
  );
}

function PageHeader({ title, count, icon: Icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4"
    >
      <div className="p-3 bg-indigo-100 rounded-xl">
        <Icon className="w-8 h-8 text-indigo-600" />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-2xl font-semibold text-indigo-600">{count} total</p>
      </div>
    </motion.div>
  );
}

function UserCard({ user, delay = 0 }) {
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'moderator': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ 
        y: -4,
        boxShadow: "0 20px 25px -5px rgba(0, 0,0, 0.1), 0 10px 10px -5px rgba(0, 0,0, 0.04)"
      }}
      className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-indigo-200"
    >
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <Users className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-xl text-gray-900 mb-1 leading-tight">
            {user.name || 'Unknown User'}
          </h3>
          <p className="text-sm text-gray-600 mb-3 truncate">{user.email || 'No email'}</p>
          <div className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getRoleColor(user.role)}`}>
            {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectCard({ project, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ 
        y: -4,
        boxShadow: "0 20px 25px -5px rgba(0, 0,0, 0.1), 0 10px 10px -5px rgba(0, 0,0, 0.04)"
      }}
      className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-emerald-200 overflow-hidden"
    >
      <div className="w-full h-40 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 mb-6 flex items-center justify-center">
        <FolderKanban className="w-16 h-16 text-white" />
      </div>
      <h3 className="font-bold text-xl text-gray-900 mb-2 leading-tight">
        {project.name || 'Untitled Project'}
      </h3>
      <p className="text-sm text-gray-600">{project.description || 'No description'}</p>
    </motion.div>
  );
}

function IssueCard({ issue, delay = 0 }) {
  const statusConfig = {
    open: { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', label: 'Open' },
    closed: { color: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Closed' },
    'in-progress': { color: 'bg-orange-100 text-orange-800 border-orange-200', label: 'In Progress' },
  };

  const status = statusConfig[issue.status?.toLowerCase()] || statusConfig.closed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ 
        y: -4,
        boxShadow: "0 20px 25px -5px rgba(0, 0,0, 0.1), 0 10px 10px -5px rgba(0, 0,0, 0.04)"
      }}
      className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-pink-200"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-bold text-xl text-gray-900 flex-1 pr-4 leading-tight">
          {issue.title || 'Untitled Issue'}
        </h3>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${status.color}`}>
          {status.label}
        </div>
      </div>
      <p className="text-sm text-gray-600 line-clamp-2">
        {issue.description || 'No description available'}
      </p>
    </motion.div>
  );
}
