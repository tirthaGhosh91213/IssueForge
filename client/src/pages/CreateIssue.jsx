import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  UploadCloud,
  User,
  Flag,
  CheckCircle,ArrowLeft 
} from "lucide-react";

export default function CreateIssue() {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    assignedTo: "",
    media: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  // --------------------------
  // FETCH EMPLOYEES
  // --------------------------
  useEffect(() => {
    fetch("http://localhost:5000/api/admin/users")
      .then((r) => r.json())
      .then((d) => setEmployees(d.users || []));
  }, []);

  // --------------------------
  // CHANGE HANDLER
  // --------------------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // --------------------------
  // FILE UPLOAD
  // --------------------------
  const handleFile = (file) => {
    setForm({ ...form, media: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  // --------------------------
  // SUBMIT
  // --------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const fd = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) fd.append(key, form[key]);
    });

    const res = await fetch(
      `http://localhost:5000/api/issues/create/${projectId}`,
      {
        method: "POST",
        body: fd,
      }
    );

    const data = await res.json();

    setLoading(false);

    if (data.success) {
      setSuccess(data.issue);
    }
  };

  const priorityColor = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
  };

  // --------------------------
  // SUCCESS SCREEN
  // --------------------------
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">

        <motion.div
          initial={{ scale: 0.7 }}
          animate={{ scale: 1 }}
          className="bg-white p-10 rounded-3xl shadow-2xl text-center space-y-5"
        >
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
          <h2 className="text-2xl font-bold">Issue Created Successfully</h2>
          <p>{success.title}</p>

          <button
            onClick={() => navigate(-1)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl"
          >
            Back to Projects
          </button>
        </motion.div>
      </div>
    );
  }

  // --------------------------
  // FORM
  // --------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 flex items-center justify-center p-6">

      <button
  onClick={() => navigate(-1)}
  className="
    fixed top-6 left-6 z-50
    w-12 h-12
    bg-white/80 backdrop-blur-xl
    border border-gray-200
    rounded-2xl
    shadow-lg
    flex items-center justify-center
    hover:scale-110 hover:shadow-xl
    transition-all duration-300
  "
>
  <ArrowLeft className="w-5 h-5 text-gray-700" />
</button>
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 w-full max-w-xl space-y-6"
      >
        <h1 className="text-3xl font-bold text-center">Create Issue</h1>

        {/* TITLE */}
        <input
          name="title"
          placeholder="Issue title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
          required
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          placeholder="Describe the issue"
          value={form.description}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
          required
        />

        {/* PRIORITY */}
        <div>
          <label className="flex items-center gap-2 mb-2 font-semibold">
            <Flag size={16} /> Priority
          </label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className={`w-full p-3 rounded-xl ${priorityColor[form.priority]}`}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* ASSIGN EMPLOYEE */}
        <div>
          <label className="flex items-center gap-2 mb-2 font-semibold">
            <User size={16} /> Assign Employee
          </label>
          <select
            name="assignedTo"
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name} ({emp.empId})
              </option>
            ))}
          </select>
        </div>

        {/* DRAG & DROP UPLOAD */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer hover:bg-gray-50"
        >
          <UploadCloud className="mx-auto mb-3 text-gray-400" />
          <p>Drag & drop image/video or click to upload</p>

          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => handleFile(e.target.files[0])}
            className="hidden"
            id="fileUpload"
          />

          <label htmlFor="fileUpload" className="text-indigo-600 underline cursor-pointer">
            Browse Files
          </label>
        </div>

        {/* PREVIEW */}
        {preview && (
          <>
            {form.media?.type?.startsWith("video") ? (
              <video src={preview} controls className="rounded-xl" />
            ) : (
              <img src={preview} alt="" className="rounded-xl" />
            )}
          </>
        )}

        {/* SUBMIT */}
        <button
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:scale-105 transition"
        >
          {loading ? "Creating..." : "Create Issue"}
        </button>
      </motion.form>
    </div>
  );
}
