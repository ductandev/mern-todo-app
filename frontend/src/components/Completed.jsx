import React, { useContext } from "react";
import TaskContext from "../context/TaskContext";
import CompletedTask from "./CompletedTask";

function Completed() {
  const { tasks } = useContext(TaskContext);
  const completedTasks = tasks?.filter((t) => t.completed) || [];

  if (completedTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center mb-3">
          <svg
            className="w-6 h-6 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-sm text-zinc-500">
          No completed tasks yet. Keep going!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {tasks.map(
        (task, index) =>
          task.completed && <CompletedTask key={index} task={task} id={index} />
      )}
    </div>
  );
}

export default Completed;
