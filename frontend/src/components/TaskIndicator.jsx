import React from "react";
import { NavLink } from "react-router-dom";

const tabs = [
  { to: "/", label: "All", end: true },
  { to: "/active", label: "Active" },
  { to: "/completed", label: "Completed" },
];

function TaskIndicator() {
  return (
    <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-lg w-fit">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            `px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              isActive
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-900"
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
}

export default TaskIndicator;
