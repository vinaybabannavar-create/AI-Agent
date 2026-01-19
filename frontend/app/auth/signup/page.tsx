"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await signup(name, email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container fade-in">
      <div className="glass-card auth-card slide-up">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join the future of AI Document Intelligence</p>

        {error && <div className="error-message">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              placeholder="Full Name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
          <div className="input-group">
            <input
              placeholder="Confirm Password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-premium w-full">Get Started</button>
        </form>
        <div className="auth-footer">
          <span>Already have an account? </span>
          <Link href="/auth/login" className="auth-link">Sign In</Link>
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
