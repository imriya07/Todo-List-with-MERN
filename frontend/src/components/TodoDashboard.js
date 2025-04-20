import React, { useState, useEffect } from "react";
import axios from "axios";

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
      const res = await axios.get("http://localhost:5000/api/tasks");
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim() === "" || description.trim() === "") return;

    try {
      if (editTaskId) {
        await axios.put(`http://localhost:5000/api/tasks/${editTaskId}`, {
          title,
          description,
        });
      } else {
        await axios.post("http://localhost:5000/api/tasks", { title, description });
      }
      fetchTasks();
      setTitle("");
      setDescription("");
      setEditTaskId(null);
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const markAsCompleted = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/tasks/${id}/complete`);
      fetchTasks();
    } catch (error) {
      console.error("Error marking task as completed:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEdit = (task) => {
    setEditTaskId(task._id);
    setTitle(task.title);
    setDescription(task.description);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3 todo-background ">
      <div className="container p-4 bg-white rounded shadow mt-5 " style={{ maxWidth: "600px"}}>
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
                  {t.completed && <span className="badge bg-success">Done</span>}
                </h5>
                <p className="mb-1 description-text">{t.description}</p>
              </div>
              <div className="d-flex gap-2 mt-2 mt-md-0">
                {!t.completed && (
                  <button
                    onClick={() => markAsCompleted(t._id)}
                    className="btn btn-sm btn-primary"
                    title="Mark as Completed"
                  >
                    <i className="bi bi-check2-circle"></i>
                  </button>
                )}
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
  );
};

export default TodoDashboard;
