const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['To-Do', 'In Progress', 'Completed'], default: 'To-Do' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dueDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);