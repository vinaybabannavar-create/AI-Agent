"use client";

import { useAgents } from "../../context/AgentContext";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

function TimeAgo({ timestamp }: { timestamp: number }) {
  const [text, setText] = useState('');
  useEffect(() => {
    const update = () => {
      const diff = Date.now() - timestamp;
      if (diff < 5000) setText('just now');
      else if (diff < 60000) setText(`${Math.floor(diff / 1000)}s ago`);
      else if (diff < 3600000) setText(`${Math.floor(diff / 60000)}m ago`);
      else setText(`${Math.floor(diff / 3600000)}h ago`);
    };
    update();
    const i = setInterval(update, 5000);
    return () => clearInterval(i);
  }, [timestamp]);
  return <span>{text}</span>;
}

export default function AgentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getAgent, toggleAgentStatus, updateAgent, deleteAgent, agents } = useAgents();
  const [agent, setAgent] = useState(getAgent(params.id as string));
  const logRef = useRef<HTMLDivElement>(null);

  // Keep agent data fresh
  useEffect(() => {
    setAgent(agents.find(a => a.id === params.id));
  }, [agents, params.id]);

  if (!agent) {
    return (
      <div className="detail-container fade-in">
        <div className="glass-card slide-up" style={{ padding: '3rem', textAlign: 'center' }}>
          <h2>Agent Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>This agent may have been deleted.</p>
          <Link href="/dashboard" className="btn-premium">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm(`Delete agent "${agent.name}"? This cannot be undone.`)) {
      deleteAgent(agent.id);
      router.push('/dashboard');
    }
  };

  const statusColors: Record<string, string> = {
    active: '#4ade80', processing: '#facc15', paused: '#94a3b8', error: '#f87171',
  };

  return (
    <div className="detail-container fade-in">
      <Link href="/dashboard" className="back-link">← Back to Dashboard</Link>

      {/* Header */}
      <div className="agent-header glass slide-up">
        <div className="header-left">
          <span className="big-avatar">🤖</span>
          <div>
            <h1 className="agent-name">{agent.name}</h1>
            <span className="agent-cap">{agent.capability}</span>
          </div>
        </div>
        <div className="header-right">
          <div className="status-badge" style={{
            background: `${statusColors[agent.status]}20`,
            color: statusColors[agent.status],
            borderColor: `${statusColors[agent.status]}40`,
          }}>
            <span className="dot" style={{
              background: statusColors[agent.status],
              boxShadow: `0 0 8px ${statusColors[agent.status]}`,
            }}></span>
            {agent.status}
          </div>
          <button className="btn-secondary btn-sm" onClick={() => toggleAgentStatus(agent.id)}>
            {agent.status === 'active' ? '⏸ Pause' : '▶ Resume'}
          </button>
          <Link href={`/chat/${agent.id}`} className="btn-premium btn-sm">💬 Chat</Link>
          <button className="btn-danger btn-sm" onClick={handleDelete}>Delete</button>
        </div>
      </div>

      {/* Metrics */}
      <div className="metrics-grid">
        <div className="metric-card glass zoom-in">
          <span className="metric-icon">⚡</span>
          <div className="metric-value">{agent.tasksCompleted}</div>
          <div className="metric-label">Tasks Completed</div>
        </div>
        <div className="metric-card glass zoom-in">
          <span className="metric-icon">❌</span>
          <div className="metric-value">{agent.tasksFailed}</div>
          <div className="metric-label">Tasks Failed</div>
        </div>
        <div className="metric-card glass zoom-in">
          <span className="metric-icon">📊</span>
          <div className="metric-value">{agent.successRate.toFixed(1)}%</div>
          <div className="metric-label">Success Rate</div>
          <div className="metric-bar">
            <div className="bar-fill" style={{ width: `${agent.successRate}%` }}></div>
          </div>
        </div>
        <div className="metric-card glass zoom-in">
          <span className="metric-icon">⏱️</span>
          <div className="metric-value">{(agent.avgProcessingTime / 1000).toFixed(1)}s</div>
          <div className="metric-label">Avg Process Time</div>
        </div>
      </div>

      <div className="detail-grid">
        {/* Config */}
        <div className="config-panel glass">
          <h3>Configuration</h3>
          <div className="config-row">
            <span className="config-key">Speed</span>
            <span className="config-val tag">{agent.speed}</span>
          </div>
          <div className="config-row">
            <span className="config-key">Priority</span>
            <span className="config-val tag tag-priority">{agent.priority}</span>
          </div>
          <div className="config-row">
            <span className="config-key">Auto-Process</span>
            <span className="config-val">{agent.autoProcess ? '✅ Enabled' : '❌ Disabled'}</span>
          </div>
          <div className="config-row">
            <span className="config-key">Created</span>
            <span className="config-val">{new Date(agent.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="config-row">
            <span className="config-key">Last Active</span>
            <span className="config-val"><TimeAgo timestamp={agent.lastActive} /></span>
          </div>
          {agent.description && (
            <div className="config-desc">
              <span className="config-key">Description</span>
              <p>{agent.description}</p>
            </div>
          )}
        </div>

        {/* Activity Log */}
        <div className="log-panel glass">
          <h3>Live Activity Log</h3>
          <div className="log-scroll" ref={logRef}>
            {agent.activityLog.length === 0 ? (
              <div className="log-empty">No activity yet. Agent is standing by...</div>
            ) : (
              agent.activityLog.slice(0, 50).map(entry => (
                <div key={entry.id} className={`log-item log-${entry.type}`}>
                  <span className="log-time"><TimeAgo timestamp={entry.timestamp} /></span>
                  <span className="log-msg">{entry.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .detail-container {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .back-link {
          display: inline-block;
          color: var(--text-secondary);
          text-decoration: none;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          transition: color 0.3s;
        }
        .back-link:hover { color: var(--accent-primary); }

        /* Header */
        .agent-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem;
          border-radius: 20px;
          margin-bottom: 1.5rem;
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .big-avatar {
          font-size: 3rem;
          filter: drop-shadow(0 0 15px var(--accent-primary));
        }
        .agent-name {
          font-size: 2rem;
          margin: 0;
        }
        .agent-cap {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 1rem;
          border-radius: 20px;
          border: 1px solid;
          font-size: 0.85rem;
          text-transform: capitalize;
          font-weight: 600;
        }
        .dot {
          width: 8px; height: 8px;
          border-radius: 50%;
        }
        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
          border-radius: 8px;
        }
        .btn-danger {
          background: rgba(248, 113, 113, 0.1);
          border: 1px solid rgba(248, 113, 113, 0.3);
          color: #f87171;
          cursor: pointer;
          transition: all 0.3s;
          font-weight: 600;
        }
        .btn-danger:hover { background: #f87171; color: white; }

        /* Metrics */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .metric-card {
          padding: 1.5rem;
          border-radius: 16px;
          text-align: center;
          transition: transform 0.3s, border-color 0.3s;
        }
        .metric-card:hover { transform: translateY(-3px); border-color: var(--accent-primary); }
        .metric-icon { font-size: 1.8rem; display: block; margin-bottom: 0.5rem; }
        .metric-value {
          font-family: 'Outfit', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 0.25rem;
        }
        .metric-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .metric-bar {
          height: 4px;
          background: rgba(255,255,255,0.05);
          border-radius: 4px;
          margin-top: 0.75rem;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
          border-radius: 4px;
          transition: width 1s ease;
        }

        /* Detail Grid */
        .detail-grid {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 1.5rem;
        }

        /* Config */
        .config-panel {
          padding: 1.5rem;
          border-radius: 16px;
        }
        .config-panel h3 { margin-bottom: 1.25rem; font-size: 1.1rem; }
        .config-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.65rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .config-key { color: var(--text-secondary); font-size: 0.85rem; }
        .config-val { font-size: 0.85rem; font-weight: 600; }
        .tag {
          padding: 0.2rem 0.6rem;
          border-radius: 6px;
          background: rgba(99,102,241,0.15);
          color: var(--accent-primary);
          text-transform: capitalize;
        }
        .config-desc { margin-top: 1rem; }
        .config-desc p { color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.3rem; }

        /* Log */
        .log-panel {
          padding: 1.5rem;
          border-radius: 16px;
        }
        .log-panel h3 { margin-bottom: 1rem; font-size: 1.1rem; }
        .log-scroll {
          max-height: 400px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .log-scroll::-webkit-scrollbar { width: 4px; }
        .log-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .log-item {
          padding: 0.6rem 0.8rem;
          border-radius: 8px;
          background: rgba(255,255,255,0.02);
          border-left: 3px solid transparent;
          animation: log-in 0.3s ease-out;
          font-size: 0.8rem;
        }
        .log-task_completed { border-left-color: #4ade80; }
        .log-task_failed { border-left-color: #f87171; }
        .log-status_change { border-left-color: #facc15; }
        .log-info { border-left-color: var(--accent-primary); }
        @keyframes log-in {
          from { opacity:0; transform: translateX(10px); }
          to { opacity:1; transform: translateX(0); }
        }
        .log-time { font-size: 0.7rem; color: var(--text-secondary); display: block; margin-bottom: 0.15rem; }
        .log-msg { color: var(--text-primary); }
        .log-empty { text-align: center; padding: 2rem; color: var(--text-secondary); }

        @media (max-width: 768px) {
          .agent-header { flex-direction: column; gap: 1rem; text-align: center; }
          .header-right { flex-wrap: wrap; justify-content: center; }
          .metrics-grid { grid-template-columns: repeat(2, 1fr); }
          .detail-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
