import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function UpdateProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    githubUrl: "",
    image: "",
  });

  const [preview, setPreview] = useState("");

  // fetch project
  useEffect(() => {
    fetch(`http://localhost:5000/api/admin/project/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm(data.project);
        setPreview(
          `http://localhost:5000/uploads/${data.project.image}`
        );
      });
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("description", form.description);
    fd.append("githubUrl", form.githubUrl);
    if (form.image instanceof File) fd.append("image", form.image);

    await fetch(`http://localhost:5000/api/admin/project/${id}`, {
      method: "PUT",
      body: fd,
    });

    alert("Project updated ✅");
    navigate("/admin/projects");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-8"
    >
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-center">Update Project</h2>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Project Name"
          className="w-full border p-3 rounded-xl"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-3 rounded-xl"
        />

        <input
          name="githubUrl"
          value={form.githubUrl}
          onChange={handleChange}
          placeholder="GitHub URL"
          className="w-full border p-3 rounded-xl"
        />

        <input type="file" onChange={handleImage} />

        {preview && (
          <img
            src={preview}
            alt=""
            className="h-40 w-full object-cover rounded-xl"
          />
        )}

        <button className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:scale-105">
          Update Project
        </button>
      </motion.form>
    </motion.div>
  );
}
