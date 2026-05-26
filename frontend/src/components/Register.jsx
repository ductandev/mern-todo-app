import React, { useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "../Axios/axios.js";
import TokenContext from "../context/TokenContext.js";

function Register() {
  const [formData, setFormData] = useState({});
  const { userToken, tokenDispatch, userDispatch } = useContext(TokenContext);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError();
    try {
      const result = await axios.post("/user/register", formData);
      tokenDispatch({ type: "SET_TOKEN", payload: result.data.token });
      userDispatch({ type: "SET_USER", payload: result.data.user });
      localStorage.setItem("authToken", JSON.stringify(result.data.token));
    } catch (err) {
      setError({
        message: err.response?.data?.message || "Registration failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center animate-fade-in">
      {userToken && <Navigate to="/" />}
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-card border border-zinc-200/70 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Create your account
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Get started in less than a minute.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                Full name
              </label>
              <input
                type="text"
                name="name"
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-white border border-zinc-300 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-white border border-zinc-300 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                required
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-white border border-zinc-300 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-400 rounded-lg shadow-sm transition-colors"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-sm text-zinc-500 text-center mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-brand-600 hover:text-brand-700"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
