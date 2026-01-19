"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container fade-in">
      <div className="glass-card auth-card slide-up">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Continue your journey with AI Agents</p>

        {error && <div className="error-message">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              placeholder="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              placeholder="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-premium w-full">Sign In</button>
        </form>
        <div className="auth-footer">
          <span>Don't have an account? </span>
          <Link href="/auth/signup" className="auth-link">Sign Up</Link>
        </div>
      </div>

      <style jsx>{`
        .auth-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 70px);
          padding: 2rem;
        }
        .auth-card {
          width: 100%;
          max-width: 440px;
          text-align: center;
        }
        .auth-title {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        .auth-subtitle {
          color: var(--text-secondary);
          margin-bottom: 2rem;
        }
        .error-message {
          background: rgba(255, 68, 68, 0.1);
          color: #ff4444;
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          border: 1px solid rgba(255, 68, 68, 0.2);
        }
        .auth-form {
          margin-bottom: 1.5rem;
        }
        .w-full {
          width: 100%;
        }
        .auth-footer {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .auth-link {
          color: var(--accent-secondary);
          text-decoration: none;
          font-weight: 600;
        }
        .auth-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
