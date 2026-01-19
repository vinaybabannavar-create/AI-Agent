"use client";

import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const [recentAgents, setRecentAgents] = useState<string[]>([]);

  useEffect(() => {
    // Load recently created agents from localStorage
    const agents = localStorage.getItem('recentAgents');
    if (agents) {
      setRecentAgents(JSON.parse(agents));
    }
  }, []);

  if (!user) {
    return (
      <div className="dash-container fade-in">
        <div className="glass-card dash-card slide-up">
          <h2 className="dash-title">Access Denied</h2>
          <p className="dash-subtitle">Please sign in to access your dashboard.</p>
          <Link href="/auth/login" className="btn-premium">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-container fade-in">
      <div className="perspective">
        <div className="glass-card dash-card slide-up">
          <h1 className="dash-welcome zoom-in">
            Dashboard <span className="gradient-text">{user.name}</span>
          </h1>
          <p className="dash-subtitle">
            Welcome back to your workspace. Your documents and AI agents are ready for action.
          </p>

          {recentAgents.length > 0 && (
            <div className="recent-agents glass">
              <h3>✓ Recently Created Agents</h3>
              <div className="agent-list">
                {recentAgents.map((agent, index) => (
                  <div key={index} className="agent-item">
                    <span className="agent-icon">🤖</span>
                    <span className="agent-name">{agent}</span>
                    <span className="agent-status">Active</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="action-grid">
            <div className="action-card glass">
              <h3>Document Analysis</h3>
              <p>Upload and analyze multi-modal documents with AI.</p>
              <Link href="/documents/upload" className="btn-premium btn-small">
                Launch Agent
              </Link>
            </div>
            <div className="action-card glass">
              <h3>Agent Builder</h3>
              <p>Create and configure custom AI agents for specialized tasks.</p>
              <Link href="/chat/new" className="btn-premium btn-small">
                Create New
              </Link>
            </div>
            <div className="action-card glass">
              <h3>History</h3>
              <p>View your previous analyses and agent performance.</p>
              <Link href="/dashboard/history" className="btn-secondary btn-small">
                View History
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dash-container {
          padding: 4rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .dash-card {
          width: 100%;
          text-align: left;
        }
        .dash-welcome {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        .dash-subtitle {
          font-size: 1.1rem;
          color: var(--text-secondary);
          margin-bottom: 3rem;
          max-width: 700px;
        }
        .recent-agents {
          padding: 1.5rem;
          border-radius: 16px;
          margin-bottom: 2rem;
          border: 1px solid rgba(99, 102, 241, 0.3);
        }
        .recent-agents h3 {
          margin-bottom: 1rem;
          color: var(--accent-primary);
          font-size: 1.2rem;
        }
        .agent-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .agent-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .agent-icon {
          font-size: 1.5rem;
        }
        .agent-name {
          flex: 1;
          font-weight: 500;
        }
        .agent-status {
          font-size: 0.85rem;
          color: #4ade80;
          padding: 0.25rem 0.75rem;
          background: rgba(74, 222, 128, 0.1);
          border-radius: 12px;
        }
        .action-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        .action-card {
          padding: 2rem;
          border-radius: 20px;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }
        .action-card:hover {
          transform: translateY(-5px);
          border-color: var(--accent-primary);
        }
        .action-card h3 {
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }
        .action-card p {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
        }
        .btn-small {
          padding: 0.75rem 1.5rem;
          font-size: 0.9rem;
        }
        .btn-secondary {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}