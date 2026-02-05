import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function ProjectIssues() {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch(`http://localhost:5000/api/issues?page=${page}&limit=5`)
      .then((r) => r.json())
      .then((d) => setIssues(d.issues || []));
  }, [page]);

  const color = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
  };

  return (
    <div className="p-8 space-y-8">
      <button onClick={() => navigate(-1)}>
        <ArrowLeft />
      </button>

      <h2 className="text-3xl font-bold">Issues</h2>

      <div className="grid gap-6">
        {issues.map((i) => (
          <div
            key={i._id}
            className="bg-white p-5 rounded-2xl shadow-md flex justify-between"
          >
            <div>
              <h3 className="font-bold">{i.title}</h3>
              <p className="text-gray-500 text-sm">{i.description}</p>
            </div>

            <span className={`px-3 py-1 rounded-lg ${color[i.priority]}`}>
              {i.priority}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Prev
        </button>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}
