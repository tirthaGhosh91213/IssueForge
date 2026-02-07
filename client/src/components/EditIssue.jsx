import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  UploadCloud,
  Flag,
  CheckCircle,
  ArrowLeft,
  Loader2,
  Pencil,
  Trash2,
  Image as ImageIcon
} from "lucide-react";

export default function EditIssue() {
  const navigate = useNavigate();
  const { issueId } = useParams();

  // ✅ Form state WITHOUT assignedTo
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    media: null,
    currentMedia: null
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // ✅ FETCH ISSUE DATA ON LOAD
  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/issues/${issueId}`);
        const data = await response.json();
        
        if (data.success && data.issue) {
          const issue = data.issue;
          setForm({
            title: issue.title || "",
            description: issue.description || "",
            priority: issue.priority || "medium",
            media: null,
            currentMedia: issue.media || null
          });
          
          if (issue.media) {
            setPreview(`http://localhost:5000/uploads/${issue.media}`);
          }
        }
      } catch (error) {
        console.error("Error fetching issue:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [issueId]);

  // --------------------------
  // CHANGE HANDLER
  // --------------------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // --------------------------
  // FILE UPLOAD - IMAGES ONLY
  // --------------------------
  const handleFile = (file) => {
    // ✅ IMAGES ONLY - No video support
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file only (JPG, PNG, WebP)');
      return;
    }
    
    setForm({ ...form, media: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const removeCurrentMedia = () => {
    setForm({ ...form, currentMedia: null });
    setPreview(null);
  };

  // --------------------------
  // UPDATE SUBMIT - PUT API
  // --------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const fd = new FormData();
    
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("priority", form.priority);

    // ✅ Send new media if uploaded (image only)
    if (form.media) {
      fd.append("media", form.media);
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/issues/update/${issueId}`,
        {
          method: "PUT",
          body: fd,
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setSuccess(data.issue);
      }
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setUpdating(false);
    }
  };

  // --------------------------
  // DELETE ISSUE
  // --------------------------
  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    try {
      await fetch(`http://localhost:5000/api/issues/${issueId}`, {
        method: "DELETE"
      });
      navigate(-1);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const priorityColor = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
  };

  // --------------------------
  // LOADING SCREEN
  // --------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-100">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-indigo-500 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-600 font-medium">Loading issue details...</p>
        </div>
      </div>
    );
  }

  // --------------------------
  // SUCCESS SCREEN
  // --------------------------
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
        <motion.div
          initial={{ scale: 0.7 }}
          animate={{ scale: 1 }}
          className="bg-white p-10 rounded-3xl shadow-2xl text-center space-y-5 max-w-md w-full"
        >
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Issue Updated Successfully!</h2>
            <p className="text-lg text-gray-600 mt-2">{success.title}</p>
          </div>
          <div className="space-y-3 pt-6 border-t">
            <button
              onClick={() => navigate(`/admin/issues/edit/${issueId}`)}
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all"
            >
              Edit Again
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-all"
            >
              Back to Issues
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // --------------------------
  // MAIN EDIT FORM - SIMPLIFIED
  // --------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 flex items-center justify-center p-6">
      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(-1)}
        className="
          fixed top-6 left-6 z-50
          w-14 h-14
          bg-white/90 backdrop-blur-xl
          border border-gray-200
          rounded-2xl
          shadow-lg
          flex items-center justify-center
          hover:scale-110 hover:shadow-xl hover:bg-white
          transition-all duration-300
        "
      >
        <ArrowLeft className="w-5 h-5 text-gray-700" />
      </motion.button>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 w-full max-w-lg space-y-8 relative"
      >
        {/* Header */}
        <div className="text-center pb-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Edit Issue
          </h1>
          <p className="text-gray-600 mt-2">Update title, description, priority & image</p>
        </div>

        {/* TITLE */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Issue Title</label>
          <input
            name="title"
            placeholder="Enter issue title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all shadow-sm hover:shadow-md text-lg"
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Description</label>
          <textarea
            name="description"
            placeholder="Describe the issue in detail..."
            value={form.description}
            onChange={handleChange}
            rows={5}
            className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all resize-vertical shadow-sm hover:shadow-md"
            required
          />
        </div>

        {/* PRIORITY */}
        <div>
          <label className="flex items-center gap-2 mb-3 font-semibold text-gray-700">
            <Flag className="w-4 h-4" /> Priority
          </label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className={`w-full p-4 rounded-2xl shadow-sm border border-gray-200 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all font-semibold text-lg ${
              priorityColor[form.priority] || 'bg-gray-50'
            }`}
          >
            <option value="low">🟢 Low Priority</option>
            <option value="medium">🟡 Medium Priority</option>
            <option value="high">🔴 High Priority</option>
          </select>
        </div>

        {/* CURRENT IMAGE PREVIEW */}
        {form.currentMedia && !preview && (
          <div className="relative group bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-gray-200">
            <img
              src={`http://localhost:5000/uploads/${form.currentMedia}`}
              alt="Current image"
              className="w-full h-64 object-cover rounded-xl shadow-md mx-auto max-w-md"
            />
            <div className="flex items-center justify-center gap-3 mt-3">
              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-mono">
                Current: {form.currentMedia.split('-').pop()}
              </span>
              <button
                type="button"
                onClick={removeCurrentMedia}
                className="flex items-center gap-1 bg-red-100 text-red-700 px-4 py-2 rounded-xl hover:bg-red-200 transition-all text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Remove Image
              </button>
            </div>
          </div>
        )}

        {/* DRAG & DROP UPLOAD - IMAGES ONLY */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5" /> Update Image (Optional)
          </label>
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group min-h-[200px] flex flex-col items-center justify-center"
          >
            <UploadCloud className="w-20 h-20 mx-auto mb-6 text-gray-400 group-hover:text-indigo-500 transition-all duration-200" />
            <div>
              <p className="text-xl font-semibold text-gray-700 mb-1">Drag & drop image here</p>
              <p className="text-sm text-gray-500 mb-6">JPG, PNG, WebP only (max 10MB)</p>
            </div>

            <input
              type="file"
              accept="image/*"  // ✅ IMAGES ONLY
              onChange={(e) => handleFile(e.target.files[0])}
              className="hidden"
              id="fileUpload"
            />

            <label 
              htmlFor="fileUpload" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold cursor-pointer hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <UploadCloud className="w-4 h-4" />
              Choose New Image
            </label>
          </div>

          {/* NEW IMAGE PREVIEW */}
          {preview && (
            <div className="mt-6 p-6 bg-indigo-50/50 rounded-2xl border-2 border-indigo-200/50 backdrop-blur-sm">
              <img 
                src={preview} 
                alt="New image preview" 
                className="w-full max-h-72 object-cover rounded-xl shadow-lg mx-auto" 
              />
              <div className="flex items-center justify-center gap-4 mt-4">
                <span className="text-sm text-indigo-700 bg-indigo-100 px-4 py-2 rounded-xl font-medium">
                  ✅ New image ready to upload
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setPreview(null);
                    setForm({ ...form, media: null });
                  }}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium underline"
                >
                  Change Image
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ACTION BUTTONS - SIMPLIFIED */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleDelete}
            disabled={updating}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-8 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
          >
            {deleteConfirm ? (
              <>
                <Trash2 className="w-5 h-5" />
                Confirm Delete
              </>
            ) : (
              <>
                <Trash2 className="w-5 h-5" />
                Delete Issue
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={updating}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 px-8 rounded-2xl font-bold shadow-2xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition-all duration-200 flex items-center justify-center gap-3 text-lg disabled:opacity-50"
          >
            {updating ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Updating Issue...
              </>
            ) : (
              " Update Issue"
            )}
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
}
