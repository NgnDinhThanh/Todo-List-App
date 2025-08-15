import React, { useEffect, useMemo, useState } from "react";
import TaskForm from "./components/TaskForm.jsx";
import TaskItem from "./components/TaskItem.jsx";
import Filters from "./components/Filters.jsx";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [counts, setCounts] = useState({ all: 0, active: 0, completed: 0 });
  const [query, setQuery] = useState({
    filter: "all",
    q: "",
    priority: "",
    sort: "createdAt_desc",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const qs = useMemo(() => new URLSearchParams(query).toString(), [query]);

  async function fetchTasks() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/tasks?${qs}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed");
      setTasks(json.items || json.data || []);
      setCounts(json.counts);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, [qs]);

  async function addTask(payload) {
    await fetch(`${API}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    fetchTasks();
  }
  async function updateTask(id, payload) {
    await fetch(`${API}/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    fetchTasks();
  }
  async function deleteTask(id) {
    await fetch(`${API}/api/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  }
  async function clearCompleted() {
    await fetch(`${API}/api/tasks`, { method: "DELETE" });
    fetchTasks();
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4 bg-slate-50 min-h-screen">
      <header className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
        <h1 className="text-2xl font-semibold text-gray-800">To-Do</h1>
        <div className="text-sm text-slate-500">
          <span className="mr-3">
            All: <b>{counts.all}</b>
          </span>
          <span className="mr-3">
            Active: <b>{counts.active}</b>
          </span>
          <span>
            Completed: <b>{counts.completed}</b>
          </span>
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow p-4 space-y-3">
        <TaskForm onAdd={addTask} />
        <Filters value={query} onChange={setQuery} />
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        {error && (
          <div className="bg-rose-100 border border-rose-200 text-rose-700 px-3 py-2 rounded-xl mb-2">
            {error}
          </div>
        )}
        {loading ? (
          <p>Loading…</p>
        ) : tasks.length === 0 ? (
          <p className="text-slate-500">No tasks.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((t) => (
              <TaskItem
                key={t._id}
                task={t}
                onUpdate={updateTask}
                onDelete={deleteTask}
              />
            ))}
          </ul>
        )}

        <div className="mt-3">
          <button
            className="px-3 py-2 rounded-xl border border-slate-200 text-sm hover:bg-slate-50"
            onClick={fetchTasks}
          >
            Refresh
          </button>
          <button
            className="px-3 py-2 rounded-xl border border-slate-200 text-sm hover:bg-slate-50 ml-2"
            onClick={clearCompleted}
          >
            Clear completed
          </button>
        </div>
      </div>

      <footer className="text-center text-sm text-slate-500">
        Built with React + Tailwind • Backend Express API
      </footer>
    </div>
  );
}
