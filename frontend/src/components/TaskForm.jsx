import React, { useState } from "react";

export default function TaskForm({ onAdd }){
  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");

  function submit(e){
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), dueDate: dueDate || null, priority });
    setName(""); setDueDate(""); setPriority("medium");
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-2">
      <input className="border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200"
             value={name} onChange={e=>setName(e.target.value)} placeholder="Add a task…" />
      <input className="border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200"
             type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
      <select className="border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200"
              value={priority} onChange={e=>setPriority(e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button className="px-3 py-2 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 text-sm" type="submit">Add</button>
    </form>
  );
}
