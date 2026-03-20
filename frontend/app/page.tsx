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
          min-height: 90vh;
          padding: 2rem;
          text-align: center;
        }
        .hero-title {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          line-height: 1.1;
        }
        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto 2.5rem;
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
          .hero-title { font-size: 2.5rem; }
          .cta-group { flex-direction: column; }
        }
      `}</style>
    </main>
  );
}
