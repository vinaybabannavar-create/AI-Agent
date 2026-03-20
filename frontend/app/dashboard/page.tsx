"use client";

import { useAuth } from "../context/AuthContext";
import { useAgents, Agent } from "../context/AgentContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

// ─── Animated Counter ────────────────────────────────────────────────
function AnimatedNumber({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number>(0);

  useEffect(() => {
    const start = ref.current;
    const diff = value - start;
    const duration = 800;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + diff * eased;
      setDisplay(current);
      ref.current = current;
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);

  return <>{display.toFixed(decimals)}</>;
}

// ─── Status Dot ──────────────────────────────────────────────────────
function StatusDot({ status }: { status: Agent['status'] }) {
  const colors: Record<string, string> = {
    active: '#4ade80',
    processing: '#facc15',
    paused: '#94a3b8',
    error: '#f87171',
  };
  return (
    <span className="status-dot" style={{
      background: colors[status] || '#94a3b8',
      boxShadow: `0 0 8px ${colors[status] || '#94a3b8'}`,
    }}>
      <style jsx>{`
        .status-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          display: inline-block;
          animation: ${status === 'active' ? 'dot-pulse 2s infinite' : 'none'};
        }
        @keyframes dot-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
      `}</style>
    </span>
  );
}

// ─── Time Ago ────────────────────────────────────────────────────────
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

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const { agents, globalActivityFeed, totalStats, deleteAgent, toggleAgentStatus, deployAgent } = useAgents();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deployingId, setDeployingId] = useState<string | null>(null);

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

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setTimeout(() => {
      deleteAgent(id);
      setDeletingId(null);
    }, 300);
  };

  return (
    <div className="dash-container fade-in">
      {/* Stats Bar */}
      <div className="stats-bar slide-up">
        <div className="stat-card glass">
          <span className="stat-icon">🤖</span>
          <div>
            <div className="stat-value"><AnimatedNumber value={totalStats.agents} /></div>
            <div className="stat-label">Active Agents</div>
          </div>
        </div>
        <div className="stat-card glass">
          <span className="stat-icon">⚡</span>
          <div>
            <div className="stat-value"><AnimatedNumber value={totalStats.tasks} /></div>
            <div className="stat-label">Tasks Processed</div>
          </div>
        </div>
        <div className="stat-card glass">
          <span className="stat-icon">📊</span>
          <div>
            <div className="stat-value"><AnimatedNumber value={totalStats.avgSuccess} decimals={1} />%</div>
            <div className="stat-label">Avg Success Rate</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dash-grid">
        {/* Agents Section */}
        <div className="agents-section">
          <div className="section-header">
            <h2 className="section-title">Your <span className="gradient-text">Agents</span></h2>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link href="/chat/new" className="btn-premium btn-small">+ New Agent</Link>
            </div>
          </div>

          {agents.length === 0 ? (
            <div className="empty-state glass">
              <span className="empty-icon">🚀</span>
              <p>No agents yet. Create your first agent to get started!</p>
              <Link href="/chat/new" className="btn-premium">Create Agent</Link>
            </div>
          ) : (
            <div className="agent-cards">
              {agents.map(agent => (
                <div
                  key={agent.id}
                  className={`agent-card glass ${deletingId === agent.id ? 'deleting' : ''}`}
                >
                  <div className="agent-card-header">
                    <div className="agent-identity">
                      <span className="agent-avatar">🤖</span>
                      <div>
                        <h3 className="agent-card-name">{agent.name}</h3>
                        <span className="agent-capability">{agent.capability}</span>
                      </div>
                    </div>
                    <div className="agent-status-badges">
                      {agent.isDeployed && (
                        <div className="live-pill">
                          <span className="live-dot"></span>
                          LIVE
                        </div>
                      )}
                      <div className="agent-status-badge">
                        <StatusDot status={agent.status} />
                        <span className="status-label">{agent.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="agent-metrics">
                    <div className="metric">
                      <span className="metric-value">{agent.tasksCompleted}</span>
                      <span className="metric-label">Tasks</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value">{agent.successRate.toFixed(1)}%</span>
                      <span className="metric-label">Success</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value"><TimeAgo timestamp={agent.lastActive} /></span>
                      <span className="metric-label">Last Active</span>
                    </div>
                  </div>

                  {/* Mini activity bar */}
                  <div className="mini-activity-bar">
                    <div className="activity-fill" style={{
                      width: `${Math.min(agent.successRate, 100)}%`,
                      background: agent.successRate > 90
                        ? 'linear-gradient(90deg, #4ade80, #22d3ee)'
                        : agent.successRate > 70
                          ? 'linear-gradient(90deg, #facc15, #fb923c)'
                          : 'linear-gradient(90deg, #f87171, #ef4444)',
                    }}></div>
                  </div>

                  <div className="agent-card-actions-premium">
                    <Link href={`/agents/${agent.id}`} className="p-action-btn p-action-view" title="View Details">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                      <span>Details</span>
                    </Link>
                    <Link href={`/chat/${agent.id}`} className="p-action-btn p-action-chat" title="Open Chat">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                      <span>Chat</span>
                    </Link>
                    {!agent.isDeployed ? (
                      <button 
                        className={`p-action-btn p-action-deploy ${deployingId === agent.id ? 'deploying' : ''}`}
                        onClick={async () => {
                          setDeployingId(agent.id);
                          await deployAgent(agent.id);
                          setDeployingId(null);
                        }}
                        disabled={agent.status === 'processing'}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
                        <span>{deployingId === agent.id ? 'Deploying...' : 'Go Live'}</span>
                      </button>
                    ) : (
                      <Link href={`/live/${agent.id}`} className="p-action-btn p-action-live" title="View Public Page">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                        <span>Public Link</span>
                      </Link>
                    )}
                    <div className="h-divider"></div>
                    <button 
                      className={`p-action-btn p-action-toggle ${agent.status === 'active' ? 'is-active' : ''}`} 
                      onClick={() => toggleAgentStatus(agent.id)}
                      title={agent.status === 'active' ? 'Pause Agent' : 'Resume Agent'}
                    >
                      {agent.status === 'active' ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                      )}
                    </button>
                    <button className="p-action-btn p-action-delete" onClick={() => handleDelete(agent.id)} title="Delete Agent">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="feed-section">
          <h3 className="feed-title">Live Activity Feed</h3>
          <div className="activity-feed glass">
            {globalActivityFeed.length === 0 ? (
              <div className="feed-empty">Waiting for agent activity...</div>
            ) : (
              globalActivityFeed.slice(0, 20).map(entry => (
                <div key={entry.id} className={`feed-item feed-${entry.type}`}>
                  <span className="feed-time">
                    <TimeAgo timestamp={entry.timestamp} />
                  </span>
                  <span className="feed-msg">{entry.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

        {/* Templates Gallery */}
        <div className="templates-section slide-up">
          <h2 className="section-title">Ready-made <span className="gradient-text">Templates</span></h2>
          <div className="templates-grid">
            <div className="template-card glass">
              <div className="template-icon">📈</div>
              <h4>Market Analyst</h4>
              <p>Specialized in budget summaries and trend forecasting.</p>
              <button 
                className="btn-use-template"
                onClick={() => router.push('/chat/new?name=Market+Analyst&capability=Structured+Data+Extraction&description=Specialized+in+budget+summaries+and+trend+forecasting.')}
              >
                Use Template
              </button>
            </div>
            <div className="template-card glass">
              <div className="template-icon">⚖️</div>
              <h4>Legal Researcher</h4>
              <p>Extracts key clauses and risks from legal documents.</p>
              <button 
                className="btn-use-template"
                onClick={() => router.push('/chat/new?name=Legal+Researcher&capability=Document+Processing&description=Extracts+key+clauses+and+risks+from+legal+documents.')}
              >
                Use Template
              </button>
            </div>
            <div className="template-card glass">
              <div className="template-icon">✍️</div>
              <h4>Content Strategist</h4>
              <p>Generates blog posts and social media copy from data.</p>
              <button 
                className="btn-use-template"
                onClick={() => router.push('/chat/new?name=Content+Strategist&capability=Document+Processing&description=Generates+blog+posts+and+social+media+copy+from+data.')}
              >
                Use Template
              </button>
            </div>
          </div>
        </div>

        {/* Global Stats bar moved here for better flow */}
        <div className="stats-bar slide-up" style={{ marginTop: '2rem' }}>
          <div className="stat-card glass">
            <span className="stat-icon">📈</span>
            <div>
              <div className="stat-label">Public Reach</div>
              <div className="stat-value">0</div>
            </div>
          </div>
          <div className="stat-card glass">
            <span className="stat-icon">🌐</span>
            <div>
              <div className="stat-label">Agents Live</div>
              <div className="stat-value">{agents.filter(a => a.isDeployed).length}</div>
            </div>
          </div>
        </div>

      <style jsx>{`
        .dash-container {
          padding: 2rem 2rem 4rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Stats Bar */
        .stats-bar {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          border-radius: 16px;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-3px);
          border-color: var(--accent-primary);
        }
        .stat-icon { font-size: 2rem; }
        .stat-value {
          font-family: 'Outfit', sans-serif;
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .stat-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Grid */
        .dash-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        /* Section Header */
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .section-title {
          font-size: 1.5rem;
          margin: 0;
        }

        /* Agent Cards */
        .agent-cards {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .agent-card {
          padding: 1.5rem;
          border-radius: 16px;
          transition: all 0.3s ease;
          animation: card-in 0.4s ease-out;
        }
        .agent-card:hover {
          border-color: rgba(99, 102, 241, 0.4);
          transform: translateY(-2px);
        }
        .agent-card.deleting {
          opacity: 0;
          transform: translateX(-30px);
          transition: all 0.3s ease;
        }
        @keyframes card-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .agent-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .agent-identity {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .agent-avatar {
          font-size: 1.8rem;
          filter: drop-shadow(0 0 8px var(--accent-primary));
        }
        .agent-card-name {
          font-size: 1.05rem;
          margin: 0;
          font-weight: 600;
        }
        .agent-capability {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        .agent-status-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          text-transform: capitalize;
          color: var(--text-secondary);
        }

        /* Metrics */
        .agent-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .metric {
          text-align: center;
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
        }
        .metric-value {
          display: block;
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--text-primary);
        }
        .metric-label {
          font-size: 0.65rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Mini activity bar */
        .mini-activity-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 1rem;
        }
        .activity-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 1s ease;
        }

        /* Premium Actions */
        .agent-card-actions-premium {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 1.25rem;
          padding-top: 1.25rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .p-action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.7rem 1.2rem;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .p-action-btn:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.25);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        .p-action-view {
          flex: 1;
          background: rgba(99, 102, 241, 0.08);
          border-color: rgba(99, 102, 241, 0.2);
          color: #a5b4fc;
        }
        .p-action-view:hover {
          background: rgba(99, 102, 241, 0.15);
          border-color: var(--accent-primary);
          color: white;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }
        .p-action-chat {
          flex: 1.5;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2));
          border-color: rgba(99, 102, 241, 0.3);
          color: white;
        }
        .p-action-chat:hover {
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-tertiary));
          border-color: transparent;
          box-shadow: 0 0 25px rgba(99, 102, 241, 0.5);
        }
        .p-action-deploy {
          background: rgba(16, 185, 129, 0.1);
          border-color: rgba(16, 185, 129, 0.4);
          color: #4ade80;
        }
        .p-action-deploy:hover {
          background: #10b981;
          color: white;
          border-color: transparent;
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
        }
        .p-action-live {
          background: rgba(59, 130, 246, 0.15);
          border-color: rgba(59, 130, 246, 0.4);
          color: #60a5fa;
          cursor: default;
        }
        .h-divider { width: 1px; height: 24px; background: rgba(255, 255, 255, 0.1); margin: 0 0.25rem; }
        
        .agent-status-badges { display: flex; align-items: center; gap: 0.75rem; }
        .live-pill {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.2rem 0.6rem;
          background: rgba(34, 197, 94, 0.15);
          color: #4ade80;
          border-radius: 6px;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          border: 1px solid rgba(74, 222, 128, 0.3);
        }
        .live-dot {
          width: 5px; height: 5px;
          background: #4ade80;
          border-radius: 50%;
          box-shadow: 0 0 5px #4ade80;
          animation: blink 1s infinite alternate;
        }
        @keyframes blink { from { opacity: 0.3; } to { opacity: 1; } }
        .h-divider { width: 1px; height: 24px; background: rgba(255, 255, 255, 0.1); margin: 0 0.25rem; }
        .p-action-toggle {
          padding: 0.7rem;
        }
        .p-action-toggle.is-active {
          color: #facc15;
          background: rgba(250, 204, 21, 0.05);
          border-color: rgba(250, 204, 21, 0.2);
        }
        .p-action-toggle:hover {
          background: rgba(250, 204, 21, 0.1);
          border-color: #facc15;
          color: #facc15;
        }
        .p-action-delete {
          padding: 0.7rem;
          color: rgba(255, 77, 77, 0.6);
        }
        .p-action-delete:hover {
          background: rgba(255, 77, 77, 0.1);
          border-color: #ff4444;
          color: #ff4444;
          box-shadow: 0 4px 15px rgba(255, 68, 68, 0.2);
        }

        /* Empty state */
        .empty-state {
          text-align: center;
          padding: 3rem;
          border-radius: 20px;
        }
        .empty-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }
        .empty-state p {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }

        /* Feed */
        .feed-section { }
        .feed-title {
          font-size: 1.1rem;
          margin-bottom: 1rem;
          color: var(--text-secondary);
        }
        .activity-feed {
          border-radius: 16px;
          padding: 1rem;
          max-height: 600px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .activity-feed::-webkit-scrollbar { width: 4px; }
        .activity-feed::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .feed-item {
          padding: 0.6rem 0.8rem;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.02);
          border-left: 3px solid transparent;
          animation: feed-in 0.3s ease-out;
          font-size: 0.8rem;
        }
        .feed-task_completed { border-left-color: #4ade80; }
        .feed-task_failed { border-left-color: #f87171; }
        .feed-status_change { border-left-color: #facc15; }
        .feed-info { border-left-color: var(--accent-primary); }
        @keyframes feed-in {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .feed-time {
          font-size: 0.7rem;
          color: var(--text-secondary);
          display: block;
          margin-bottom: 0.2rem;
        }
        .feed-msg { color: var(--text-primary); }
        .feed-empty {
          text-align: center;
          padding: 2rem;
          color: var(--text-secondary);
          font-size: 0.85rem;
        }

        /* Templates Gallery */
        .templates-section { margin-bottom: 3rem; }
        .templates-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-top: 1rem;
        }
        .template-card {
          padding: 1.5rem;
          border-radius: 16px;
          text-align: center;
          transition: all 0.3s ease;
        }
        .template-card:hover {
          border-color: var(--accent-primary);
          transform: scale(1.02);
        }
        .template-icon { font-size: 2.5rem; margin-bottom: 1rem; }
        .template-card h4 { margin-bottom: 0.5rem; color: white; }
        .template-card p { font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 1.25rem; }
        .btn-use-template {
          width: 100%;
          padding: 0.6rem;
          border-radius: 8px;
          border: 1px solid rgba(99, 102, 241, 0.3);
          background: rgba(99, 102, 241, 0.05);
          color: #a5b4fc;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-use-template:hover {
          background: var(--accent-primary);
          color: white;
        }

        /* Quick Actions */
        .quick-actions {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
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
        .action-card h3 { margin-bottom: 1rem; font-size: 1.3rem; }
        .action-card p {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }
        .btn-small {
          padding: 0.6rem 1.2rem;
          font-size: 0.85rem;
        }

        @media (max-width: 1024px) {
          .dash-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .dash-container { padding: 1rem 1rem 3rem; }
          .stats-bar { grid-template-columns: 1fr; }
          .templates-grid { grid-template-columns: 1fr; }
          .agent-card-actions-premium { flex-wrap: wrap; }
          .p-action-btn { flex: 1 1 140px; }
          .h-divider { display: none; }
        }
        @media (max-width: 480px) {
          .agent-metrics { grid-template-columns: 1fr; }
          .p-action-btn { width: 100%; }
        }
      `}</style>
    </div>
  );
}