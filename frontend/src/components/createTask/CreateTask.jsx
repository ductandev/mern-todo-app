import React, { useState, useContext } from "react";
import TaskContext from "../../context/TaskContext";
import TokenContext from "../../context/TokenContext";
import axios from "../../Axios/axios.js";

function CreateTask() {
  const { dispatch } = useContext(TaskContext);
  const { userToken } = useContext(TokenContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(
        "/task/addTask",
        { title, description },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      dispatch({ type: "ADD_TASK", title, description });
      setTitle("");
      setDescription("");
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-card border border-zinc-200/70 p-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="w-7 h-7 rounded-lg bg-brand-50 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-brand-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </span>
        <h2 className="text-base font-semibold text-zinc-900">New task</h2>
      </div>

      <form onSubmit={handleAdd} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-zinc-700 mb-1.5"
          >
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What do you want to do?"
            className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-white border border-zinc-300 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-zinc-700 mb-1.5"
          >
            Description
          </label>
          <textarea
            rows={4}
            name="description"
            id="description"
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
            style={{ resize: "none" }}
            placeholder="Add some details..."
            className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-white border border-zinc-300 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-400 rounded-lg shadow-sm transition-colors"
        >
          {submitting ? "Adding..." : "Add task"}
        </button>
      </form>
    </div>
  );
}

export default CreateTask;
