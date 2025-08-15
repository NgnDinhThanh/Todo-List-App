const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    completed: { type: Boolean, default: false, index: true },
    dueDate: { type: Date, default: null },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
      index: true,
    },
  },
  { timestamps: true }
);

TaskSchema.virtual("isOverdue").get(function () {
  if (!this.dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return !this.completed && this.dueDate < today;
});

TaskSchema.set("toJSON", { virtuals: true });
TaskSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Task", TaskSchema);
