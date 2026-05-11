import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Zap, Users, FolderKanban, Search, Mail, Paperclip,
  ArrowRight, Menu, X, ChevronRight, Star, Quote,
  Github, Twitter, Linkedin, Globe, Shield, BarChart3,
  CheckCircle2, MousePointerClick
} from "lucide-react";

/* ─── Animated Background ─── */
function AnimatedBG() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[#07070d]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          animation: "grid-fade 8s ease-in-out infinite"
        }}
      />
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/15 blur-[150px]" style={{ animation: "float 20s ease-in-out infinite" }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/15 blur-[150px]" style={{ animation: "float 25s ease-in-out infinite 5s" }} />
      <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[130px]" style={{ animation: "pulse-glow 10s ease-in-out infinite" }} />
    </div>
  );
}

/* ─── Section Wrapper ─── */
function Section({ children, className = "", id }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`relative z-10 ${className}`}
    >
      {children}
    </motion.section>
  );
}

/* ─── Stat Item ─── */
function StatItem({ end, suffix, label }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (inView) {
      let start = 0;
      const duration = 2000; // 2 seconds
      const increment = end / (duration / 16); // 60fps
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [inView, end]);

  return (
    <div ref={ref} className="text-center px-4">
      <div className="text-3xl md:text-4xl font-bold text-white font-[Space_Grotesk]">
        {count}{suffix}
      </div>
      <p className="text-sm text-gray-400 mt-1 tracking-wide">{label}</p>
    </div>
  );
}

/* ─── Feature Card ─── */
function FeatureCard({ icon: Icon, title, desc, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-8 hover:border-indigo-500/30 hover:bg-white/[0.06] transition-all duration-500"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-5 group-hover:bg-indigo-500/20 group-hover:border-indigo-400/40 transition-all duration-300">
          <Icon size={22} className="text-indigo-400 group-hover:text-indigo-300 transition-colors" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2 font-[Space_Grotesk]">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

/* ─── Step Card ─── */
function StepCard({ num, title, desc, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="relative text-center px-6"
    >
      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-2xl font-bold text-white mb-5 shadow-lg shadow-indigo-500/20 font-[Space_Grotesk]">
        {num}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2 font-[Space_Grotesk]">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">{desc}</p>
    </motion.div>
  );
}

/* ─── Testimonial Card ─── */
function TestimonialCard({ name, role, text }) {
  return (
    <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-8 hover:border-indigo-500/20 transition-all duration-300">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-amber-400 fill-amber-400" />)}
      </div>
      <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">"{text}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm">{name[0]}</div>
        <div>
          <p className="text-white text-sm font-semibold">{name}</p>
          <p className="text-gray-500 text-xs">{role}</p>
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════
   MAIN HOME PAGE COMPONENT
═══════════════════════════════════════════ */
export default function HomePage() {
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalIssues: 0,
    resolvedIssues: 0,
    totalUsers: 0
  });
  const [recentIssues, setRecentIssues] = useState([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    
    // Fetch real data from DB
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/public/stats");
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
          setRecentIssues(data.recentIssues);
        }
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };
    fetchStats();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" }
  ];

  const features = [
    { icon: Zap, title: "Lightning Fast", desc: "Instant issue creation and real-time status updates. No lag, no waiting — just pure speed." },
    { icon: Users, title: "Team Collaboration", desc: "Assign multiple employees, manage roles, and keep everyone aligned with smart notifications." },
    { icon: FolderKanban, title: "Project Management", desc: "Organize projects with images, GitHub links, and full CRUD control from your dashboard." },
    { icon: Mail, title: "Email Alerts", desc: "Automatic email notifications when issues are assigned. Your team stays informed, always." },
    { icon: Search, title: "Smart Search", desc: "Filter issues by status, priority, project — find anything in seconds with powerful search." },
    { icon: Paperclip, title: "Media Attachments", desc: "Attach screenshots, logs, or files directly to issues for crystal-clear bug reports." }
  ];

  return (
    <div className="min-h-screen bg-[#07070d] text-white overflow-x-hidden">
      <AnimatedBG />

      {/* ═══ NAVBAR ═══ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#07070d]/80 backdrop-blur-xl border-b border-white/[0.06] shadow-2xl" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div whileHover={{ scale: 1.03 }} className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0 })}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <span className="text-lg font-bold">U</span>
            </div>
            <span className="text-xl font-bold font-[Space_Grotesk] tracking-tight">IssueForge</span>
          </motion.div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <a key={l.label} href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors duration-200">{l.label}</a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => navigate("/login")} className="text-sm text-gray-300 hover:text-white px-4 py-2 transition-colors">Log in</button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate("/login")}
              className="text-sm font-medium bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 transition-all">
              Get Started <ArrowRight size={14} className="inline ml-1" />
            </motion.button>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white p-2" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenu && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0d0d15]/95 backdrop-blur-xl border-t border-white/[0.06]">
              <div className="px-6 py-6 space-y-4">
                {navLinks.map(l => (
                  <a key={l.label} href={l.href} onClick={() => setMobileMenu(false)} className="block text-gray-300 hover:text-white py-2">{l.label}</a>
                ))}
                <button onClick={() => { setMobileMenu(false); navigate("/login"); }}
                  className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white py-3 rounded-xl font-medium mt-2">Get Started</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative z-10 min-h-screen flex items-center justify-center pt-20">
        <div className="max-w-5xl mx-auto text-center px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-8 tracking-wide">
            <Zap size={12} className="fill-indigo-400" /> Now in Beta — Built for Modern Teams
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.1] tracking-tight font-[Space_Grotesk]">
            Build.{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">Track.</span>
            <br />
            Deliver Faster.
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="text-gray-400 text-base md:text-xl mt-7 max-w-2xl mx-auto leading-relaxed">
            A powerful issue & project management platform engineered for speed, clarity, and seamless team collaboration.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate("/login")}
              className="w-full sm:w-auto group relative bg-gradient-to-r from-indigo-500 to-violet-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all overflow-hidden">
              <span className="relative z-10 flex items-center justify-center gap-2">Get Started Free <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></span>
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-gray-300 hover:text-white px-6 py-4 rounded-2xl border border-white/10 hover:border-white/20 hover:bg-white/[0.03] transition-all">
              <MousePointerClick size={18} /> Explore Features
            </motion.button>
          </motion.div>

          {/* Hero Glow (Dashboard Preview) */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2, duration: 1 }}
            className="mt-20 relative max-w-4xl mx-auto hidden sm:block">
            <div className="absolute inset-0 bg-gradient-to-t from-[#07070d] via-transparent to-transparent z-10 pointer-events-none" />
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm p-1 shadow-2xl shadow-indigo-500/10">
              <div className="rounded-xl bg-[#0d0d15] p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  <span className="text-xs text-gray-600 ml-3 font-mono">dashboard.issueforge.dev</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { l: "Open Issues", v: stats.totalIssues - stats.resolvedIssues, c: "text-amber-400 bg-amber-400/10" }, 
                    { l: "In Progress", v: recentIssues.filter(i => i.status === 'working').length || "—", c: "text-blue-400 bg-blue-400/10" }, 
                    { l: "Resolved", v: stats.resolvedIssues, c: "text-emerald-400 bg-emerald-400/10" }
                  ].map(s => (
                    <div key={s.l} className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">{s.l}</p>
                      <p className={`text-2xl font-bold mt-1 font-[Space_Grotesk] ${s.c.split(" ")[0]}`}>{s.v}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-2">
                  {(recentIssues.length > 0 ? recentIssues : [
                    { title: "No recent issues", priority: "Low", status: "fixed" }
                  ]).map((r, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/[0.02] rounded-lg px-4 py-3 border border-white/[0.04]">
                      <span className="text-sm text-gray-300 truncate max-w-[200px]">{r.title}</span>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${r.priority === "high" ? "bg-red-500/15 text-red-400" : r.priority === "medium" ? "bg-amber-500/15 text-amber-400" : "bg-blue-500/15 text-blue-400"}`}>{r.priority}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${r.status === "pending" ? "bg-gray-500/15 text-gray-400" : r.status === "working" ? "bg-blue-500/15 text-blue-400" : "bg-emerald-500/15 text-emerald-400"}`}>{r.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <Section className="py-20 border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatItem end={stats.totalIssues} suffix="+" label="Issues Tracked" />
          <StatItem end={stats.totalProjects} suffix="+" label="Active Projects" />
          <StatItem end={stats.totalUsers} suffix="+" label="Builders Joining" />
          <StatItem end={stats.resolvedIssues} suffix="" label="Issues Resolved" />
        </div>
      </Section>

      {/* ═══ FEATURES ═══ */}
      <Section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs text-indigo-400 font-semibold tracking-widest uppercase">Features</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3 font-[Space_Grotesk]">Everything you need to <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">ship faster</span></h2>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto text-sm md:text-base">Built for developers and project managers who value speed, simplicity, and clarity.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => <FeatureCard key={f.title} icon={f.icon} title={f.title} desc={f.desc} delay={i * 0.08} />)}
          </div>
        </div>
      </Section>

      {/* ═══ HOW IT WORKS ═══ */}
      <Section id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs text-indigo-400 font-semibold tracking-widest uppercase">How it works</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3 font-[Space_Grotesk]">Three steps to <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">clarity</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10 relative">
            <div className="hidden md:block absolute top-8 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
            <StepCard num="1" title="Create Your Project" desc="Set up your project with a name, description, GitHub link, and cover image in seconds." delay={0} />
            <StepCard num="2" title="Report & Assign Issues" desc="Create issues with priority levels, attach media, and assign to one or multiple team members." delay={0.15} />
            <StepCard num="3" title="Track & Resolve" desc="Monitor progress with real-time status updates, comments, and smart filters until resolution." delay={0.3} />
          </div>
        </div>
      </Section>

      {/* ═══ CTA ═══ */}
      <Section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative rounded-3xl border border-white/[0.08] bg-gradient-to-br from-indigo-500/10 via-transparent to-violet-500/10 p-8 md:p-16 overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-indigo-500/10 blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-violet-500/10 blur-[100px]" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold font-[Space_Grotesk] mb-4">Ready to forge your workflow?</h2>
              <p className="text-gray-400 text-sm md:text-lg mb-8 max-w-lg mx-auto">Join teams who've already streamlined their issue tracking with IssueForge.</p>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate("/login")}
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-violet-600 text-white px-10 py-4 rounded-2xl text-lg font-semibold shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all">
                Get Started Free <ArrowRight size={18} className="inline ml-2" />
              </motion.button>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ FOOTER ═══ */}
      <footer className="relative z-10 border-t border-white/[0.06] mt-10">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">U</span>
                </div>
                <span className="text-lg font-bold font-[Space_Grotesk]">IssueForge</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">Built by ULMiND. A modern issue tracking platform for teams that move fast.</p>
              <div className="flex items-center gap-3 mt-5">
                {[Github, Twitter, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.06] flex items-center justify-center text-gray-400 hover:text-white transition-all">
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
            {[
              { title: "Product", links: ["Features", "Pricing", "Changelog", "Docs"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
              { title: "Legal", links: ["Privacy", "Terms", "Security", "Status"] }
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-sm font-semibold text-white mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map(l => <li key={l}><a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/[0.06] mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="text-xs text-gray-600">© 2026 ULMiND IssueForge. All rights reserved.</p>
            <p className="text-xs text-gray-600">Crafted with ❤️ by <span className="text-indigo-400">Tirtha</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
