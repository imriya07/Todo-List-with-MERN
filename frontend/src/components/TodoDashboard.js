import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TodoDashboard = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(
        "https://todo-lake-delta.vercel.app/api/tasks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks(res.data);
    } catch (error) {
      toast.error("Failed to fetch tasks.");
      console.error("Error fetching tasks:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title.trim() === "" || description.trim() === "") {
      toast.warn("Title and Description cannot be empty.");
      return;
    }

    const isDuplicateTitle = tasks.some(
      (task) =>
        task.title.trim().toLowerCase() === title.trim().toLowerCase() &&
        task._id !== editTaskId
    );

    if (isDuplicateTitle) {
      toast.info("A task with the same title already exists.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (editTaskId) {
        await axios.put(
          `https://todo-lake-delta.vercel.app/api/tasks/${editTaskId}`,
          { title, description },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.warning("Task updated successfully!");
      } else {
        await axios.post(
          "https://todo-lake-delta.vercel.app/api/tasks",
          { title, description },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Task added successfully!");
      }

      fetchTasks();
      setTitle("");
      setDescription("");
      setEditTaskId(null);
    } catch (error) {
      toast.error("Error saving task.");
      console.error("Error saving task:", error);
    }
  };

  const toggleCompletion = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("authToken");
      const updatedStatus = !currentStatus;
      await axios.patch(
        `https://todo-lake-delta.vercel.app/api/tasks/${id}/complete`,
        { completed: updatedStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTasks();
      toast.success(
        updatedStatus
          ? "Task marked as completed!"
          : "Task marked as incomplete!"
      );
    } catch (error) {
      toast.error("Error toggling task completion.");
      console.error("Error toggling task completion:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(
        `https://todo-lake-delta.vercel.app/api/tasks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks(tasks.filter((task) => task._id !== id));
      toast.error("Task deleted successfully!");
    } catch (error) {
      toast.error("Error deleting task.");
      console.error("Error deleting task:", error);
    }
  };

  const handleEdit = (task) => {
    setEditTaskId(task._id);
    setTitle(task.title);
    setDescription(task.description);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3 todo-background">
        <div
          className="container p-4 bg-white rounded shadow mt-5"
          style={{ maxWidth: "600px" }}
        >
          <h2 className="text-center mb-4 text-primary todo-heading">
            <i className="bi bi-check2-square me-2"></i>Todo List
          </h2>

          <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task Title"
                className="form-control placeholder-custom"
              />
            </div>
            <div className="mb-3">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task Description"
                className="form-control placeholder-textarea"
              />
            </div>
            <div className="row g-2">
              <div className="col-6">
                <button type="submit" className="btn btn-primary w-100">
                  {editTaskId ? (
                    <>
                      <i className="bi bi-pencil-square me-1"></i>Update
                    </>
                  ) : (
                    <>
                      <i className="bi bi-plus-circle me-1"></i>Add Task
                    </>
                  )}
                </button>
              </div>
              <div className="col-6">
                <button
                  type="button"
                  onClick={() => {
                    setTitle("");
                    setDescription("");
                    setEditTaskId(null);
                  }}
                  className="btn btn-secondary w-100"
                >
                  <i className="bi bi-x-circle me-1"></i>Cancel
                </button>
              </div>
            </div>
          </form>

          <ul className="list-group">
            {tasks.map((t) => (
              <li
                key={t._id}
                className={`list-group-item d-flex justify-content-between align-items-start flex-column flex-md-row ${
                  t.completed ? "bg-light text-muted" : ""
                }`}
                style={{
                  borderRadius: "10px",
                  marginBottom: "10px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="flex-grow-1 me-3">
                  <h5 className="mb-1 title-text">
                    {t.title}{" "}
                    {t.completed && (
                      <span className="badge bg-success">Done</span>
                    )}
                  </h5>
                  <p className="mb-1 description-text">{t.description}</p>
                </div>
                <div className="d-flex gap-2 mt-2 mt-md-0">
                  <button
                    onClick={() => toggleCompletion(t._id, t.completed)}
                    className="btn btn-sm btn-primary"
                    title={
                      t.completed ? "Mark as Incomplete" : "Mark as Completed"
                    }
                  >
                    <i
                      className={`bi bi-${
                        t.completed ? "x-circle" : "check2-circle"
                      }`}
                    ></i>
                  </button>
                  <button
                    onClick={() => handleEdit(t)}
                    className="btn btn-sm btn-warning"
                    title="Edit Task"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="btn btn-sm btn-danger"
                    title="Delete Task"
                  >
                    <i className="bi bi-trash3"></i>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default TodoDashboard;
