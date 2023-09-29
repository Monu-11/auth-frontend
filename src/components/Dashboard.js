import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiFillDelete, AiFillEdit, AiFillSave } from "react-icons/ai";
import { Toaster, toast } from "react-hot-toast";
import config from "../config/config";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState("");
  const [newText, setNewText] = useState("");

  useEffect(() => {
    axios
      .get(`${config.apiUrl}/api/user/detail`, {
        withCredentials: true,
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });

    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/api/tasks`, {
        withCredentials: true,
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${config.apiUrl}/api/logout`, null, {
        withCredentials: true,
      });
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleCreateTask = async () => {
    try {
      const response = await axios.post(
        `${config.apiUrl}/api/tasks`,
        { title },
        { withCredentials: true }
      );
      setTasks([...tasks, response.data.task]);
      setTitle("");
      toast.success("Task created successfully");
    } catch (error) {
      toast.error("Error creating task. Please try again.");
      console.error("Create Task error:", error);
    }
  };

  const handleUpdateTask = async (taskId, newTitle, newCompleted) => {
    try {
      const response = await axios.put(
        `${config.apiUrl}/api/tasks/${taskId}`,
        { title: newTitle, completed: newCompleted },
        { withCredentials: true }
      );
      const updatedTasks = tasks.map((task) =>
        task._id === taskId ? response.data.task : task
      );
      setTasks(updatedTasks);
      toast.success("Task updated successfully");
      setEditId("");
    } catch (error) {
      toast.error("Error updating task. Please try again.");
      console.error("Update Task error:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${config.apiUrl}/api/tasks/${taskId}`, {
        withCredentials: true,
      });
      const filteredTasks = tasks.filter((task) => task._id !== taskId);
      setTasks(filteredTasks);
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Error deleting task. Please try again.");
      console.error("Delete Task error:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-300 h-screen">
      <Toaster />
      <div className="flex justify-between mb-4 items-center">
        <div>
          <h1 className="text-2xl font-semibold">Welcome, {user.username}!</h1>
          <p>Email: {user.email}</p>
          <p>UserName: {user.username}</p>
        </div>
        <button
          className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <form
        className="flex flex-col items-center"
        onSubmit={(e) => e.preventDefault()}
      >
        <h1 className="text-bold text-indigo-500 text-2xl mb-4">Add Todo</h1>
        <input
          type="text"
          className="bg-gray-600 text-gray-100 ring-2 focus:ring-indigo-500 border-1 border-indigo-700 rounded focus:indigo-500 px-4 py-2 mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your task..."
        />
        <button
          className="bg-indigo-500 hover:bg-indigo-800 px-4 py-2 rounded text-white text-lg"
          type="submit"
          onClick={handleCreateTask}
        >
          Add Todo
        </button>
      </form>
      <h1 className="text-bold text-indigo-500 text-2xl mt-8 mb-4 text-center">
        Todo List
      </h1>
      <ul className="list-none w-full p-8">
        {tasks.map((todo) => (
          <li
            className="flex justify-between items-center bg-zinc-800 px-4 py-2 rounded mb-2"
            key={todo._id}
          >
            {editId === todo._id ? (
              <>
                <input
                  type="text"
                  className="bg-gray-600 text-gray-100 ring-2 focus:ring-indigo-500 border-1 border-indigo-700 rounded focus:indigo-500 px-4 py-1"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                />
                <button
                  className="bg-green-500 text-white border-0 py-1 px-4 hover:bg-green-800"
                  type="submit"
                  onClick={() => handleUpdateTask(todo._id, newText)}
                >
                  <AiFillSave />
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() =>
                      handleUpdateTask(todo._id, todo.title, !todo.completed)
                    }
                    className="mr-2"
                  />
                  <div
                    className={`text-white ${
                      todo.completed ? "line-through" : ""
                    }`}
                  >
                    {todo.title}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="bg-blue-500 text-white border-0 py-1 px-4 hover:bg-blue-800"
                    onClick={() => {
                      setEditId(todo._id);
                      setNewText(todo.title);
                    }}
                  >
                    <AiFillEdit />
                  </button>
                  <button
                    className="bg-red-500 text-white border-0 py-1 px-4 hover:bg-red-800"
                    onClick={() => handleDeleteTask(todo._id)}
                  >
                    <AiFillDelete />
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
