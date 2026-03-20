"use client";

import Link from "next/link";
import { useAuth } from "./context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="hero-container fade-in">
      <div className="perspective">
        <div className="glass-card three-d-card slide-up">
          <h1 className="hero-title zoom-in">
            <span className="gradient-text">AI Agents</span> Builder
          </h1>
          <p className="hero-subtitle">
            Next-generation multi-modal document intelligence platform.
            Build, deploy, and scale AI agents with ease.
          </p>
          <div className="cta-group">
            {user ? (
              <Link href="/dashboard" className="btn-premium">
                Go to Dashboard
              </Link>
            ) : (
              <div className="cta-wrapper">
                <Link href="/auth/signup" className="btn-premium">
                  Get Started Free
                </Link>
                <Link href="/auth/login" className="btn-secondary">
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 95vh;
          padding: 2rem;
          text-align: center;
          background: radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.05) 0%, transparent 50%);
        }
        .hero-title {
          font-size: 6rem;
          margin-bottom: 2rem;
          line-height: 0.9;
          font-weight: 800;
          letter-spacing: -0.05em;
        }
        .hero-subtitle {
          font-size: 1.6rem;
          color: var(--text-secondary);
          max-width: 800px;
          margin: 0 auto 4rem;
          line-height: 1.5;
          opacity: 0.9;
        }
        .cta-wrapper {
          display: flex;
          gap: 1.5rem;
          align-items: center;
          justify-content: center;
        }
        .cta-group {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          align-items: center;
        }
        @media (max-width: 768px) {
          .hero-container { padding: 1.5rem 0; min-height: 90vh; }
          .hero-title { font-size: 3rem; margin-bottom: 1.5rem; }
          .hero-subtitle { font-size: 1.25rem; margin-bottom: 2.5rem; padding: 0 1.5rem; }
          .cta-group, .cta-wrapper { flex-direction: column; width: 100%; gap: 1.25rem; padding: 0 1.5rem; }
          .btn-premium, .btn-secondary { width: 100%; height: 60px; font-size: 1.1rem; }
          .three-d-card { border-radius: 0; border-left: none; border-right: none; padding: 4rem 1.5rem; }
        }
      `}</style>
    </main>
  );
}
