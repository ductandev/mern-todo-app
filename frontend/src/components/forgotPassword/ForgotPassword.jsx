import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../Axios/axios.js";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setMessage("");
      setError("");
      const res = await axios.post("/forgotPassword/forgotPassword", { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center animate-fade-in">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-card border border-zinc-200/70 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Forgot password?
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          {message && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-white border border-zinc-300 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-400 rounded-lg shadow-sm transition-colors"
            >
              {isLoading ? "Sending..." : "Send reset link"}
            </button>
          </form>

          <p className="text-sm text-zinc-500 text-center mt-6">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-medium text-brand-600 hover:text-brand-700"
            >
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
