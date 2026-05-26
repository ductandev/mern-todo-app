import React, { useContext, useState, useEffect, useRef } from "react";
import { Outlet, NavLink } from "react-router-dom";
import TokenContext from "../../context/TokenContext.js";
import useLogout from "../../hooks/useLogout";

function ConfirmLogoutModal({ open, onClose, onConfirm, loading }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && !loading && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, loading]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-zinc-900/30 backdrop-blur-sm"
        onClick={() => !loading && onClose()}
      />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-card border border-zinc-200/70 p-6 animate-slide-up">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-zinc-900">
              Sign out of your account?
            </h3>
            <p className="text-sm text-zinc-500 mt-1">
              You'll need to sign in again to access your tasks.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-3.5 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-3.5 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400 rounded-lg shadow-sm transition-colors inline-flex items-center gap-2"
          >
            {loading && (
              <svg
                className="w-3.5 h-3.5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}
            {loading ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </div>
    </div>
  );
}

function UserMenu({ user, onLogoutClick }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", onClickOutside);
    return () => window.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-semibold ring-2 ring-white shadow-soft">
          {user?.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div className="hidden sm:flex flex-col items-start leading-tight">
          <span className="text-sm font-medium text-zinc-900 capitalize">
            {user?.name || "User"}
          </span>
          <span className="text-xs text-zinc-500 truncate max-w-[140px]">
            {user?.email || ""}
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-zinc-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-card border border-zinc-200/70 overflow-hidden animate-slide-up z-40">
          <div className="px-4 py-3 border-b border-zinc-100">
            <p className="text-sm font-medium text-zinc-900 capitalize truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-zinc-500 truncate">
              {user?.email || ""}
            </p>
          </div>
          <div className="p-1">
            <button
              onClick={() => {
                setOpen(false);
                onLogoutClick();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Header() {
  const { userToken, user } = useContext(TokenContext);
  const logout = useLogout();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirmLogout = async () => {
    setLoading(true);
    // small artificial delay so the UI feels responsive
    await new Promise((r) => setTimeout(r, 250));
    logout();
    setLoading(false);
    setShowConfirm(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
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

          {userToken ? (
            <UserMenu user={user} onLogoutClick={() => setShowConfirm(true)} />
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

      <ConfirmLogoutModal
        open={showConfirm}
        loading={loading}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
}

export default Header;
