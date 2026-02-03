// CreateProject.jsx
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    githubUrl: '',
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      // Clear previous errors
      setErrors(prev => ({ ...prev, image: '' }));
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'File size must be less than 5MB' }));
        setImagePreview(null);
        setImageFile(null);
        e.target.value = '';
        return;
      }

      // Set image file
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const removeImage = useCallback(() => {
    setImagePreview(null);
    setImageFile(null);
    setErrors(prev => ({ ...prev, image: '' }));
    // Reset input
    const fileInput = document.getElementById('image-upload');
    if (fileInput) fileInput.value = '';
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.githubUrl.trim()) newErrors.githubUrl = 'GitHub URL is required';
    if (!imageFile) newErrors.image = 'Project image is required';
    if (formData.githubUrl && !formData.githubUrl.startsWith('https://github.com/')) {
      newErrors.githubUrl = 'Please enter a valid GitHub URL';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, imageFile]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('description', formData.description);
    submitData.append('githubUrl', formData.githubUrl);
    submitData.append('image', imageFile);

    try {
      const response = await fetch('http://localhost:5000/api/admin/create-project', {
        method: 'POST',
        body: submitData,
      });
      const data = await response.json();

      if (data.success) {
        setSuccess(data.project);
      } else {
        alert('Error: ' + (data.message || 'Failed to create project'));
      }
    } catch (error) {
      alert('Network error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, [formData, imageFile, validateForm]);

  const resetForm = useCallback(() => {
    setFormData({ name: '', description: '', githubUrl: '' });
    setImagePreview(null);
    setImageFile(null);
    setSuccess(null);
    setErrors({});
    const fileInput = document.getElementById('image-upload');
    if (fileInput) fileInput.value = '';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 flex items-center justify-center p-6 relative">
      {/* Back Button - Fixed Left Side */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-8 left-8 z-50 group px-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl  backdrop-blur-xl border border-gray-200/50 hover:border-gray-300/70   font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 hover:bg-white "
      >
        <i className="fas fa-arrow-left mr-2 text-lg group-hover:-translate-x-1 transition-transform"></i>
        Back
      </button>

      <div className="w-full max-w-md mx-auto">
        {/* Main Card */}
        {!success ? (
          <div className="backdrop-blur-xl bg-white/95 border border-gray-200/50 shadow-2xl rounded-3xl p-8">
            <div className="text-center mb-8">
              <div className=" mx-auto mb-6 flex items-center justify-center shadow-lg">
                <i className="fas fa-plus text-3xl text-white"></i>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-3">
                New Project
              </h1>
              <p className="text-gray-600 text-lg font-medium">Create a new project showcase</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Name */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 flex items-center">
                  <i className="fas fa-project-diagram mr-2 text-purple-500 text-sm"></i>
                  Project Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Health Hub"
                  className={`w-full px-5 py-4 text-lg rounded-2xl backdrop-blur-sm border-2 border-gray-200 focus:border-purple-400/70 focus:ring-4 focus:ring-purple-200/50 transition-all duration-300 shadow-sm ${
                    errors.name ? 'border-red-300 bg-red-50/80 ring-2 ring-red-200/50' : 'hover:border-purple-200 hover:bg-gray-50/50'
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm flex items-center bg-red-50 px-3 py-2 rounded-xl border border-red-200">
                    <i className="fas fa-exclamation-circle mr-2"></i>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 flex items-center">
                  <i className="fas fa-align-left mr-2 text-pink-500 text-sm"></i>
                  Description
                </label>
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your project..."
                  className={`w-full px-5 py-4 text-lg rounded-2xl backdrop-blur-sm border-2 border-gray-200 focus:border-pink-400/70 focus:ring-4 focus:ring-pink-200/50 transition-all duration-300 resize-vertical shadow-sm ${
                    errors.description ? 'border-red-300 bg-red-50/80 ring-2 ring-red-200/50' : 'hover:border-pink-200 hover:bg-gray-50/50'
                  }`}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm flex items-center bg-red-50 px-3 py-2 rounded-xl border border-red-200">
                    <i className="fas fa-exclamation-circle mr-2"></i>
                    {errors.description}
                  </p>
                )}
              </div>

              {/* GitHub URL */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 flex items-center">
                  <i className="fab fa-github mr-2 text-gray-500 text-sm"></i>
                  GitHub URL
                </label>
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  placeholder="https://github.com/username/repo"
                  className={`w-full px-5 py-4 text-lg rounded-2xl backdrop-blur-sm border-2 border-gray-200 focus:border-indigo-400/70 focus:ring-4 focus:ring-indigo-200/50 transition-all duration-300 shadow-sm ${
                    errors.githubUrl ? 'border-red-300 bg-red-50/80 ring-2 ring-red-200/50' : 'hover:border-indigo-200 hover:bg-gray-50/50'
                  }`}
                />
                {errors.githubUrl && (
                  <p className="text-red-500 text-sm flex items-center bg-red-50 px-3 py-2 rounded-xl border border-red-200">
                    <i className="fas fa-exclamation-circle mr-2"></i>
                    {errors.githubUrl}
                  </p>
                )}
              </div>

              {/* Image Upload - FIXED */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 flex items-center">
                  <i className="fas fa-image mr-2 text-yellow-500 text-sm"></i>
                  Project Image
                </label>
                <div className="relative">
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 rounded-2xl"
                  />
                  <div className={`w-full h-40 rounded-2xl border-2 border-dashed flex items-center justify-center text-center transition-all duration-400 cursor-pointer overflow-hidden shadow-sm hover:shadow-md group relative ${
                    errors.image
                      ? 'border-red-300/70 bg-red-50/70 hover:border-red-400'
                      : imagePreview
                      ? 'border-green-400/70 bg-green-50/50 hover:border-green-500'
                      : 'border-gray-300 hover:border-purple-300 hover:bg-purple-50/30'
                  }`}>
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-xl shadow-md"
                        />
                        {/* Remove Image Button */}
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-3 right-3 w-10 h-10 bg-white/90 hover:bg-white rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 border border-gray-200 z-20 group-hover:opacity-100 opacity-0"
                        >
                          <i className="fas fa-times text-gray-600 text-sm hover:text-red-500"></i>
                        </button>
                        <div className="absolute bottom-3 left-3 bg-black/60 text-white px-3 py-1 rounded-xl text-xs font-semibold">
                          Click to change
                        </div>
                      </>
                    ) : (
                      <div className="space-y-3 p-6 text-center">
                        <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 animate-bounce"></i>
                        <div>
                          <p className="text-lg font-semibold text-gray-700">Click to upload</p>
                          <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {errors.image && (
                  <p className="text-red-500 text-sm flex items-center bg-red-50 px-3 py-2 rounded-xl border border-red-200">
                    <i className="fas fa-exclamation-circle mr-2"></i>
                    {errors.image}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-5 px-6 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 flex items-center justify-center space-x-3 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed opacity-60'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600  hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] text-white'
                }`}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-rocket"></i>
                    <span>Create Project</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Success Screen */
          <div className="backdrop-blur-xl bg-white/95 border border-gray-200/50 shadow-2xl rounded-3xl p-8">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl">
                <i className="fas fa-check text-4xl text-white"></i>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Success!
              </h2>
              <p className="text-gray-700 text-lg font-semibold">Project created successfully</p>
            </div>

            <div className="space-y-4 mb-8 p-6 bg-gray-50/80 rounded-2xl border border-gray-200">
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div><span className="font-semibold text-gray-700">Name:</span> {success.name}</div>
                <div><span className="font-semibold text-gray-700">ID:</span> {success._id}</div>
                <div><span className="font-semibold text-gray-700">Image:</span> {success.image}</div>
                <div><span className="font-semibold text-gray-700">Created:</span> {new Date(success.createdAt).toLocaleString()}</div>
                <div>
                  <span className="font-semibold text-gray-700">GitHub:</span>{' '}
                  <a href={success.githubUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 font-semibold underline">
                    {success.githubUrl}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={resetForm}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <i className="fas fa-plus"></i>
                <span>New Project</span>
              </button>
              <button
                onClick={() => navigate(-1)}
                className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-200 flex items-center justify-center space-x-2"
              >
                <i className="fas fa-home"></i>
                <span>Dashboard</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default CreateProject;
