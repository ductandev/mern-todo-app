import React, { useContext } from "react";
import Task from "./Task/Task";
import TaskContext from "../context/TaskContext";

function EmptyState({ message }) {
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>
      <p className="text-sm text-zinc-500">{message}</p>
    </div>
  );
}

function AllTask() {
  const { tasks } = useContext(TaskContext);

  if (!tasks || tasks.length === 0) {
    return <EmptyState message="No tasks yet. Add your first one!" />;
  }

  return (
    <div className="space-y-2.5">
      {tasks.map((task) => (
        <Task key={task._id} task={task} />
      ))}
    </div>
  );
}

export default AllTask;
