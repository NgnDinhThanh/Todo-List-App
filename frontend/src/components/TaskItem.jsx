import React, { useState } from "react";

export default function TaskItem({ task, onUpdate, onDelete }){
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(task.name);
  const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.slice(0,10) : "");
  const [priority, setPriority] = useState(task.priority);

  const overdue = task.isOverdue;

  function toggle(){ onUpdate(task._id, { completed: !task.completed }); }
  function save(e){
    e.preventDefault();
    onUpdate(task._id, { name, dueDate: dueDate || null, priority });
    setEdit(false);
  }

  return (
    <li className="p-3 rounded-xl border border-slate-200">
      <div className="flex items-start gap-3">
        <button onClick={toggle} title="Toggle" className={"h-7 w-7 rounded-lg border " + (task.completed ? "bg-emerald-100 border-emerald-200" : "border-slate-200")}>
          {task.completed ? "✓" : ""}
        </button>

        <div className="flex-1">
          {!edit ? (
            <>
              <div className="flex items-center gap-2">
                <span className={"font-medium " + (task.completed ? "line-through text-slate-400" : "")}>{task.name}</span>
                <span className={
                  "px-2 py-0.5 rounded-full text-xs capitalize " + (task.priority === "high" ? "bg-rose-100 text-rose-700" : task.priority === "low" ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700")
                }>{task.priority}</span>
              </div>
              <div className="text-xs text-slate-500 mt-1 space-x-3">
                {task.dueDate && <span className={overdue ? "text-rose-600 font-semibold" : ""}>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                <span>Created: {new Date(task.createdAt).toLocaleString()}</span>
              </div>
            </>
          ) : (
            <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-1">
              <input className="border border-slate-200 rounded-xl px-3 py-2" value={name} onChange={e=>setName(e.target.value)} />
              <input className="border border-slate-200 rounded-xl px-3 py-2" type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
              <select className="border border-slate-200 rounded-xl px-3 py-2" value={priority} onChange={e=>setPriority(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <div className="flex gap-2">
                <button className="px-3 py-2 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 text-sm" type="submit">Save</button>
                <button className="px-3 py-2 rounded-xl border border-slate-200 text-sm" type="button" onClick={()=>setEdit(false)}>Cancel</button>
              </div>
            </form>
          )}
        </div>

        {!edit ? (
          <div className="flex gap-2">
            <button className="px-3 py-2 rounded-xl border border-slate-200 text-sm" onClick={()=>setEdit(true)}>Edit</button>
            <button className="px-3 py-2 rounded-xl text-white bg-red-600 hover:bg-red-700 text-sm" onClick={()=>onDelete(task._id)}>Delete</button>
          </div>
        ) : null}
      </div>
    </li>
  );
}
