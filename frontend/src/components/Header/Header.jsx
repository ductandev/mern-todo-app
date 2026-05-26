import React, { useContext } from "react";
import { Outlet, NavLink } from "react-router-dom";
import TokenContext from "../../context/TokenContext.js";

function Header() {
  const token = localStorage.getItem("authToken");
  const { user } = useContext(TokenContext);

  const logout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Decorative gradient blobs */}
      <div
        className="bg-blob"
        style={{
          top: "-100px",
          left: "-100px",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.45), transparent 70%)",
        }}
      />
      <div
        className="bg-blob"
        style={{
          top: "200px",
          right: "-150px",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(168,85,247,0.35), transparent 70%)",
          animationDelay: "5s",
        }}
      />
      <div
        className="bg-blob"
        style={{
          bottom: "-100px",
          left: "30%",
          width: "450px",
          height: "450px",
          background:
            "radial-gradient(circle, rgba(236,72,153,0.25), transparent 70%)",
          animationDelay: "10s",
        }}
      />

      <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/60 border-b border-zinc-200/70">
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-soft">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </span>
            <span className="text-lg font-semibold tracking-tight text-zinc-900 group-hover:text-brand-600 transition-colors">
              Todo
            </span>
          </NavLink>

          {token ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <span className="text-zinc-500">Welcome,</span>
                <span className="font-medium text-zinc-900 capitalize">
                  {user?.name || "User"}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-semibold ring-2 ring-white shadow-soft">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <button
                onClick={logout}
                className="px-3.5 py-1.5 text-sm font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `px-3.5 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "text-brand-700 bg-brand-50"
                      : "text-zinc-700 hover:bg-zinc-100"
                  }`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="px-3.5 py-1.5 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                Sign up
              </NavLink>
            </div>
          )}
        </nav>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default Header;
