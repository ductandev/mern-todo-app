import React, { useContext } from "react";
import moment from "moment";
import TaskContext from "../../context/TaskContext";
import TokenContext from "../../context/TokenContext";
import axios from "../../Axios/axios.js";

function Task({ task }) {
  const { dispatch } = useContext(TaskContext);
  const { userToken } = useContext(TokenContext);

  const handleRemove = async (e) => {
    e.preventDefault();
    try {
      await axios.delete(`/task/removeTask/${task._id}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      dispatch({ type: "REMOVE_TASK", id: task._id });
    } catch (error) {
      console.log(error);
    }
  };

  const handleMarkDone = async () => {
    try {
      await axios.put(
        `/task/updateTask/${task._id}`,
        { completed: !task.completed },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      dispatch({ type: "MARK_DONE", id: task._id });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="group flex items-start gap-3 p-4 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-soft transition-all animate-slide-up">
      <label className="relative flex items-center justify-center mt-0.5 cursor-pointer">
        <input
          type="checkbox"
          className="peer sr-only"
          onChange={handleMarkDone}
          checked={task.completed}
        />
        <span className="w-5 h-5 rounded-md border-2 border-zinc-300 peer-checked:bg-brand-600 peer-checked:border-brand-600 transition-colors flex items-center justify-center">
          {task.completed && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </span>
      </label>

      <div className="flex-1 min-w-0">
        <h4
          className={`text-sm font-medium capitalize break-words ${
            task.completed ? "text-zinc-400 line-through" : "text-zinc-900"
          }`}
        >
          {task.title}
        </h4>
        <p
          className={`text-sm mt-0.5 break-words ${
            task.completed ? "text-zinc-400" : "text-zinc-600"
          }`}
        >
          {task.description}
        </p>
        <p className="text-xs text-zinc-400 mt-2">
          {task?.createdAt ? moment(task.createdAt).fromNow() : "just now"}
        </p>
      </div>

      <button
        onClick={handleRemove}
        aria-label="Delete task"
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-all"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"
          />
        </svg>
      </button>
    </div>
  );
}

export default Task;
