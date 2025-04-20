// backend/controllers/taskController.js

const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  const { title, description, completed } = req.body;
  try {
    const task = new Task({ title, description, completed });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Error creating task' });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(id, { title, description, completed }, { new: true });
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Error updating task' });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task' });
  }
};


exports.markTaskAsCompleted = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findByIdAndUpdate(
      id,
      { completed: true },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Error marking task as completed' });
  }
};
