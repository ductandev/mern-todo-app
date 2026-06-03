import React, { useContext } from "react";
import Task from "./Task/Task";
import TaskContext from "../context/TaskContext";

function Active() {
  const { tasks } = useContext(TaskContext);
  const activeTasks = tasks?.filter((t) => !t.completed) || [];

  if (activeTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-3">
          <svg
            className="w-6 h-6 text-emerald-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <p className="text-sm text-zinc-500">All caught up! No active tasks.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {tasks.map(
        (task) =>
          !task.completed && <Task key={task._id} task={task} />
      )}
    </div>
  );
}

export default Active;
