const dbConnection = require("../database/dbconfig");
const { StatusCodes } = require("http-status-codes");

// List all tasks for the logged-in user
const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const [tasks] = await dbConnection.query("SELECT * FROM task WHERE user_id = ?", [userId]);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks", error: error.message });
  }
};

// Create a new task
const createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, due_date, priority } = req.body;

    if (!title || !description || !due_date || !priority) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const [result] = await dbConnection.query(
      "INSERT INTO task (user_id, title, description, due_date, priority, status) VALUES (?, ?, ?, ?, ?, 'Pending')",
      [userId, title, description, due_date, priority]
    );

    res.status(201).json({ message: "Task created successfully", id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: "Failed to create task", error: error.message });
  }
};

// Update an existing task
const updateTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    const { title, description, due_date, priority, status } = req.body;

    const [task] = await dbConnection.query(
      "SELECT * FROM task WHERE id = ? AND user_id = ?",
      [taskId, userId]
    );

    if (task.length === 0) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    await dbConnection.query(
      "UPDATE task SET title = ?, description = ?, due_date = ?, priority = ?, status = ? WHERE id = ? AND user_id = ?",
      [title, description, due_date, priority, status, taskId, userId]
    );

    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update task", error: error.message });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    const [task] = await dbConnection.query(
      "SELECT * FROM task WHERE id = ? AND user_id = ?",
      [taskId, userId]
    );

    if (task.length === 0) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    await dbConnection.query("DELETE FROM task WHERE id = ? AND user_id = ?", [taskId, userId]);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task", error: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
