import React from "react";

export default function Filters({ value, onChange }){
  function update(part){ onChange({ ...value, ...part }); }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select className="border border-slate-200 rounded-xl px-3 py-2" value={value.filter} onChange={e=>update({ filter:e.target.value })}>
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>

      <input className="border border-slate-200 rounded-xl px-3 py-2" placeholder="Search…" value={value.q} onChange={e=>update({ q:e.target.value })} />

      <select className="border border-slate-200 rounded-xl px-3 py-2" value={value.priority} onChange={e=>update({ priority:e.target.value })}>
        <option value="">All priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <select className="border border-slate-200 rounded-xl px-3 py-2" value={value.sort} onChange={e=>update({ sort:e.target.value })}>
        <option value="createdAt_desc">Newest</option>
        <option value="createdAt_asc">Oldest</option>
        <option value="dueDate_asc">Due ↑</option>
        <option value="dueDate_desc">Due ↓</option>
        <option value="priority_desc">Priority ↓</option>
        <option value="priority_asc">Priority ↑</option>
      </select>
    </div>
  );
}
