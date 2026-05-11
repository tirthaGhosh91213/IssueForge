import React, { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { authFetch } from "../utils/authFetch";
import { 
  LayoutDashboard, Users, Folder, BugPlay, Activity, ArrowRight
} from "lucide-react";

export default function DashboardAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await authFetch("http://localhost:5000/api/admin/analytics");
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50/50">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full" />
      </div>
    );
  }

  if (!data) return <div className="p-8">Failed to load analytics.</div>;

  // Transform data for charts
  const statusData = [
    { name: "Pending", count: data.issuesByStatus.pending || 0, color: "#f59e0b" },
    { name: "Working", count: data.issuesByStatus.working || 0, color: "#3b82f6" },
    { name: "Fixed", count: data.issuesByStatus.fixed || 0, color: "#10b981" }
  ];

  const priorityData = [
    { name: "High", count: data.issuesByPriority.high || 0, color: "#ef4444" },
    { name: "Medium", count: data.issuesByPriority.medium || 0, color: "#f59e0b" },
    { name: "Low", count: data.issuesByPriority.low || 0, color: "#10b981" }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <LayoutDashboard className="text-indigo-600 w-8 h-8" />
          Analytics Overview
        </h2>
        <p className="text-gray-500 mt-2 text-lg">Platform statistics and issue tracking performance.</p>
      </div>

      {/* METRIC CARDS (Glassmorphism/Premium style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          title="Total Users" 
          value={data.metrics.totalUsers} 
          icon={<Users className="w-6 h-6 text-blue-600" />}
          gradient="from-blue-50 to-blue-100"
          borderColor="border-blue-200"
        />
        <MetricCard 
          title="Active Projects" 
          value={data.metrics.totalProjects} 
          icon={<Folder className="w-6 h-6 text-purple-600" />}
          gradient="from-purple-50 to-purple-100"
          borderColor="border-purple-200"
        />
        <MetricCard 
          title="Total Issues" 
          value={data.metrics.totalIssues} 
          icon={<BugPlay className="w-6 h-6 text-rose-600" />}
          gradient="from-rose-50 to-rose-100"
          borderColor="border-rose-200"
        />
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* BAR CHART */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-gray-400" />
            Issues by Status
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontWeight: 500}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                <Tooltip 
                  cursor={{fill: '#f9fafb'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-gray-400" />
            Issues by Priority
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Recent Issues Activity</h3>
          <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {data.recentIssues.map((issue) => (
            <div key={issue._id} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between">
              <div>
                <h4 className="text-md font-bold text-gray-900">{issue.title}</h4>
                <p className="text-sm text-gray-500 mt-1">Project: <span className="font-semibold text-gray-700">{issue.project?.name}</span></p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                  ${issue.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                    issue.status === 'working' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {issue.status}
                </span>
                <span className={`px-3 py-1 rounded border text-xs font-bold uppercase
                  ${issue.priority === 'high' ? 'bg-rose-50 border-rose-200 text-rose-700' : 
                    issue.priority === 'medium' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
                  {issue.priority}
                </span>
              </div>
            </div>
          ))}
          {data.recentIssues.length === 0 && (
            <div className="p-8 text-center text-gray-500">No recent activity.</div>
          )}
        </div>
      </div>

    </div>
  );
}

// Metric Card Component
function MetricCard({ title, value, icon, gradient, borderColor }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} p-6 rounded-2xl border ${borderColor} shadow-sm relative overflow-hidden`}>
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <p className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-2">{title}</p>
          <h4 className="text-4xl font-extrabold text-gray-900">{value}</h4>
        </div>
        <div className="p-3 bg-white/60 backdrop-blur-md rounded-xl shadow-sm">
          {icon}
        </div>
      </div>
      {/* Decorative circle */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
    </div>
  );
}
