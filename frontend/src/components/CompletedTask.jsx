import React from "react";
import moment from "moment";

function CompletedTask({ task }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 animate-slide-up">
      <span className="w-5 h-5 mt-0.5 rounded-md bg-brand-600 border-2 border-brand-600 flex items-center justify-center flex-shrink-0">
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
      </span>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-zinc-400 line-through capitalize break-words">
          {task.title}
        </h4>
        <p className="text-sm text-zinc-400 mt-0.5 break-words">
          {task.description}
        </p>
        <p className="text-xs text-zinc-400 mt-2">
          {task?.createdAt ? moment(task.createdAt).fromNow() : "just now"}
        </p>
      </div>
    </div>
  );
}

export default CompletedTask;
