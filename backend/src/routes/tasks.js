const express = require("express");
const Task = require("../models/Task.js"); // Adjusted import to match the new structure
const router = express.Router();

function buildQuery({ filter, q, priority }) {
  const query = {};
  if (filter === "active") query.completed = false;
  if (filter === "completed") query.completed = true;
  if (priority && ["low", "medium", "high"].includes(priority)) {
    query.priority = priority;
  }
  if (q) query.name = { $regex: q, $options: "i" }; // case-insensitive search
  return query;
}

function buildSort(sort = "createdAt_desc") {
  const map = {
    createdAt_desc: { createdAt: -1 },
    createdAt_asc: { createdAt: 1 },
    dueDate_desc: { dueDate: -1, createdAt: -1 },
    dueDate_asc: { dueDate: 1, createdAt: -1 },
    priority_desc: { priority: -1, createdAt: -1 },
    priority_asc: { priority: 1, createdAt: -1 },
  };
  return map[sort] || { createdAt: -1 };
}

router.get("/", async (req, res, next) => {
  try {
    const {
      filter = "all",
      q = "",
      priority = "",
      sort = "createdAt_desc",
    } = req.query;
    const query = buildQuery({ filter, q, priority });
    const items = await Task.find(query).sort(buildSort(sort));
    const counts = {
      all: await Task.countDocuments({}),
      active: await Task.countDocuments({ completed: false }),
      completed: await Task.countDocuments({ completed: true }),
    };
    res.json({ success: true, items, counts });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, dueDate = null, priority = "medium" } = req.body;
    const trimmed = (name || "").trim();
    if (!trimmed)
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });
    const doc = await Task.create({ name: trimmed, dueDate, priority });
    res.status(201).json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const { name, completed, dueDate, priority } = req.body;
    const payload = {};
    if (typeof name !== "undefined") payload.name = (name || "").trim();
    if (typeof completed !== "undefined") payload.completed = !!completed;
    if (typeof dueDate !== "undefined") payload.dueDate = dueDate || null;
    if (typeof priority !== "undefined") payload.priority = priority;
    const updated = await Task.findByIdAndUpdate(req.params.id, payload, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: deleted });
  } catch (error) {
    next(error);
  }
});

router.delete("/", async (_req, res, next) => {
  try {
    const result = await Task.deleteMany({ completed: true });
    res.json({ success: true, dataCount: result.deletedCount });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
