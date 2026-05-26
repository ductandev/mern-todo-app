import React, { useContext } from "react";
import TaskIndicator from "./TaskIndicator";
import CreateTask from "./createTask/CreateTask";
import { Outlet } from "react-router-dom";
import TaskContext from "../context/TaskContext";

function Layout() {
  const { tasks } = useContext(TaskContext);
  const total = tasks?.length || 0;
  const completed = tasks?.filter((t) => t.completed).length || 0;
  const active = total - completed;

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-900 bg-clip-text text-transparent">
            Your tasks
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Stay organized and get things done.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-white/60 backdrop-blur-sm border border-zinc-200/70 text-xs">
            <span className="text-zinc-500">Total</span>{" "}
            <span className="font-semibold text-zinc-900">{total}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-brand-50/80 backdrop-blur-sm border border-brand-200/60 text-xs">
            <span className="text-brand-600">Active</span>{" "}
            <span className="font-semibold text-brand-700">{active}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50/80 backdrop-blur-sm border border-emerald-200/60 text-xs">
            <span className="text-emerald-600">Done</span>{" "}
            <span className="font-semibold text-emerald-700">{completed}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <CreateTask />
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-card border border-zinc-200/70 overflow-hidden">
            <div className="px-5 pt-5 pb-3 border-b border-zinc-100">
              <TaskIndicator />
            </div>
            <div className="p-5 max-h-[70vh] overflow-y-auto">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
