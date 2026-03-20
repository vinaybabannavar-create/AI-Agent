"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAgents } from "../../context/AgentContext";

export default function NewAgentPage() {
  const router = useRouter();
  const { createAgent } = useAgents();
  const [agentName, setAgentName] = useState("");
  const [capability, setCapability] = useState("Document Processing");
  const [description, setDescription] = useState("");
  const [speed, setSpeed] = useState<'fast' | 'balanced' | 'thorough'>('balanced');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [autoProcess, setAutoProcess] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);
  const [initStatus, setInitStatus] = useState("System Standby");
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>(["[SYSTEM] Standing by for initialization..."]);
  const [createdId, setCreatedId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('name')) setAgentName(params.get('name')!);
    if (params.get('capability')) setCapability(params.get('capability')!);
    if (params.get('description')) setDescription(params.get('description')!);
  }, []);

  const handleInitialize = () => {
    if (!agentName) {
      alert("Please enter an agent name");
      return;
    }
    setIsInitializing(true);
    setInitStatus("Neural Allocation Started");
    setLogs(prev => [...prev, `[INIT] Starting builder for: ${agentName}`, "[CORE] Allocating cognitive resources..."]);

    const stages = [
      { text: "Configuring Core Logic...", log: "[CORE] Logic patterns optimized.", delay: 800 },
      { text: `Loading: ${capability}...`, log: `[MODULE] ${capability} integration complete.`, delay: 1600 },
      { text: `Speed: ${speed} | Priority: ${priority}`, log: `[PERF] Speed=${speed}, Priority=${priority} configured.`, delay: 2400 },
      { text: "Securing Encrypted Channels...", log: "[AUTH] Security layer 7 established.", delay: 3200 },
      { text: "Optimizing Synapses...", log: "[NEURAL] Weights adjusted for peak performance.", delay: 4000 },
      { text: `Agent Online: ${agentName} Ready!`, log: "[SYSTEM] Deployment successful. Agent is live.", delay: 4800 }
    ];

    stages.forEach((stage, index) => {
      setTimeout(() => {
        setInitStatus(stage.text);
        setLogs(prev => [...prev.slice(-5), stage.log]);
        setProgress((index + 1) * Math.floor(100 / stages.length));

        if (index === stages.length - 1) {
          setTimeout(() => {
            const newAgent = createAgent({
              name: agentName,
              capability,
              description,
              speed,
              priority,
              autoProcess,
            });
            setCreatedId(newAgent.id);
            setIsInitializing(false);
          }, 600);
        }
      }, stage.delay);
    });
  };

  return (
    <div className="builder-container fade-in">
      <div className="perspective">
        <div className="glass-card builder-card slide-up">
          <Link href="/dashboard" className="back-link">← Back to Dashboard</Link>
          <h2 className="builder-title">Agent <span className="gradient-text">Builder</span></h2>
          <p className="builder-subtitle">Create custom AI agents for specialized intelligence tasks.</p>

          {createdId ? (
            <div className="success-panel glass zoom-in">
              <span className="success-icon">✅</span>
              <h3>Agent "{agentName}" Deployed!</h3>
              <p>Your agent is now live and processing tasks in real-time.</p>
              <div className="success-actions">
                <Link href={`/agents/${createdId}`} className="btn-premium">View Agent Dashboard</Link>
                <Link href={`/chat/${createdId}`} className="btn-secondary">Chat with Agent</Link>
                <Link href="/dashboard" className="btn-secondary">Go to Dashboard</Link>
              </div>
            </div>
          ) : (
            <div className="workspace glass">
              <div className="config-panel">
                <div className="input-group">
                  <label>Agent Name</label>
                  <input
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="e.g. Finance Analyst"
                    disabled={isInitializing}
                  />
                </div>
                <div className="input-group">
                  <label>Capability</label>
                  <select
                    className="glass-select"
                    value={capability}
                    onChange={(e) => setCapability(e.target.value)}
                    disabled={isInitializing}
                  >
                    <option>Document Processing</option>
                    <option>Image Recognition</option>
                    <option>Structured Data Extraction</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Description <span className="optional">(optional)</span></label>
                  <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What this agent specializes in..."
                    disabled={isInitializing}
                  />
                </div>

                <div className="options-row">
                  <div className="input-group half">
                    <label>Speed</label>
                    <div className="radio-group">
                      {(['fast', 'balanced', 'thorough'] as const).map(s => (
                        <button
                          key={s}
                          className={`radio-btn ${speed === s ? 'active' : ''}`}
                          onClick={() => setSpeed(s)}
                          disabled={isInitializing}
                        >
                          {s === 'fast' ? '⚡' : s === 'balanced' ? '⚖️' : '🔬'} {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="input-group half">
                    <label>Priority</label>
                    <div className="radio-group">
                      {(['low', 'medium', 'high', 'critical'] as const).map(p => (
                        <button
                          key={p}
                          className={`radio-btn priority-btn ${priority === p ? 'active' : ''}`}
                          onClick={() => setPriority(p)}
                          disabled={isInitializing}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="toggle-group">
                  <label className="toggle-label">
                    <span>Auto-Process Tasks</span>
                    <button
                      className={`toggle ${autoProcess ? 'on' : ''}`}
                      onClick={() => setAutoProcess(!autoProcess)}
                      disabled={isInitializing}
                    >
                      <span className="toggle-knob"></span>
                    </button>
                  </label>
                  <span className="toggle-hint">
                    {autoProcess ? 'Agent will automatically process incoming tasks' : 'Agent will wait for manual task assignment'}  
                  </span>
                </div>

                <button
                  onClick={handleInitialize}
                  className={`btn-premium w-full ${isInitializing ? 'loading' : ''}`}
                  disabled={isInitializing}
                >
                  {isInitializing ? "Initializing..." : "🚀 Deploy Agent"}
                </button>
              </div>

              <div className="preview-panel glass">
                <div className="placeholder-content">
                  <div className={`status-icon ${isInitializing ? 'pulse' : ''}`}>
                    {isInitializing ? "⚡" : "🤖"}
                  </div>
                  <div className="live-log-container glass-inset">
                    <div className="log-header">NEURAL FEED v2.0</div>
                    <div className="log-window">
                      {logs.map((log, i) => (
                        <div key={i} className="log-entry">{log}</div>
                      ))}
                    </div>
                  </div>
                  <span className="status-text">{initStatus}</span>
                  {isInitializing && (
                    <div className="progress-bar-container">
                      <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .builder-container {
          padding: 1rem 2rem 4rem;
          max-width: 100%;
          margin: 0;
        }
        .builder-card { padding: 3rem; border-radius: 32px; }
        @media (max-width: 768px) {
          .builder-card { padding: 1.5rem; border-radius: 0; border-left: none; border-right: none; }
          .builder-container { padding: 0.5rem 0 3rem; }
        }
        .back-link {
          display: block;
          text-align: left;
          color: var(--accent-secondary);
          text-decoration: none;
          margin-bottom: 2rem;
          font-size: 0.95rem;
          font-weight: 500;
          opacity: 0.8;
          transition: opacity 0.2s;
        }
        .back-link:hover { opacity: 1; }
        .builder-title { font-size: 2.8rem; margin-bottom: 0.5rem; white-space: nowrap; }
        @media (max-width: 480px) {
          .builder-title { font-size: 2.2rem; }
        }
        .builder-subtitle { color: var(--text-secondary); margin-bottom: 2.5rem; }

        /* Workspace */
        .workspace {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 2rem;
          padding: 2rem;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.03);
          width: 100%;
        }
        @media (max-width: 768px) {
          .workspace { padding: 1.25rem; border-radius: 0; border-left: none; border-right: none; }
        }
        .input-group { margin-bottom: 1.25rem; text-align: left; }
        .input-group label {
          display: block;
          margin-bottom: 0.4rem;
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 500;
        }
        .optional { opacity: 0.5; font-size: 0.75rem; }
        .glass-select {
          width: 100%;
          padding: 0.8rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: white;
          appearance: none;
          font-size: 0.9rem;
        }

        /* Options */
        .options-row { display: flex; gap: 1rem; }
        .half { flex: 1; }
        .radio-group {
          display: flex;
          gap: 0.3rem;
          flex-wrap: wrap;
        }
        .radio-btn {
          padding: 0.4rem 0.7rem;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
          color: var(--text-secondary);
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: capitalize;
        }
        .radio-btn:hover { border-color: var(--accent-primary); color: white; }
        .radio-btn.active {
          background: rgba(99,102,241,0.2);
          border-color: var(--accent-primary);
          color: var(--accent-primary);
          font-weight: 600;
        }

        /* Toggle */
        .toggle-group { margin-bottom: 1.5rem; }
        .toggle-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          color: var(--text-secondary);
          cursor: pointer;
        }
        .toggle {
          width: 44px;
          height: 24px;
          border-radius: 12px;
          background: rgba(255,255,255,0.1);
          border: none;
          cursor: pointer;
          position: relative;
          transition: background 0.3s;
        }
        .toggle.on { background: var(--accent-primary); }
        .toggle-knob {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          transition: transform 0.3s;
        }
        .toggle.on .toggle-knob { transform: translateX(20px); }
        .toggle-hint {
          display: block;
          font-size: 0.7rem;
          color: var(--text-secondary);
          opacity: 0.6;
          margin-top: 0.3rem;
        }

        /* Preview */
        .preview-panel {
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.05);
          min-height: 400px;
        }
        .placeholder-content {
          text-align: center;
          color: var(--accent-primary);
          width: 100%;
          padding: 1.5rem;
        }
        .status-icon {
          font-size: 3.5rem;
          margin-bottom: 1.5rem;
          filter: drop-shadow(0 0 15px var(--accent-primary));
        }
        .pulse { animation: status-pulse 1.5s infinite; }
        @keyframes status-pulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; filter: drop-shadow(0 0 25px var(--accent-primary)); }
          100% { transform: scale(1); opacity: 0.8; }
        }
        .live-log-container {
          background: rgba(0, 0, 0, 0.4);
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          text-align: left;
          font-family: 'Courier New', Courier, monospace;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .log-header {
          font-size: 0.65rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
          letter-spacing: 1px;
          opacity: 0.5;
        }
        .log-window {
          font-size: 0.8rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .log-entry {
          color: var(--accent-secondary);
          opacity: 0.9;
          animation: slide-log 0.3s ease-out;
        }
        @keyframes slide-log {
          from { transform: translateX(-10px); opacity: 0; }
          to { transform: translateX(0); opacity: 0.9; }
        }
        .status-text {
          display: block;
          margin-top: 0.5rem;
          font-weight: 500;
          color: white;
          font-size: 1rem;
        }
        .progress-bar-container {
          width: 100%;
          max-width: 300px;
          height: 6px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          margin: 1rem auto 0;
          overflow: hidden;
        }
        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
          transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Success */
        .success-panel {
          text-align: center;
          padding: 5rem 2rem;
          border-radius: 32px;
          border: 1px solid rgba(74, 222, 128, 0.2);
          background: radial-gradient(circle at 50% 0%, rgba(74, 222, 128, 0.1) 0%, transparent 70%);
          animation: success-glow 2s infinite alternate;
        }
        @keyframes success-glow {
          from { box-shadow: 0 0 20px rgba(74, 222, 128, 0.1); }
          to { box-shadow: 0 0 40px rgba(74, 222, 128, 0.2); }
        }
        .success-icon { font-size: 5rem; display: block; margin-bottom: 2rem; filter: drop-shadow(0 0 20px #4ade80); }
        .success-panel h3 { font-size: 2.2rem; margin-bottom: 1rem; font-weight: 800; }
        .success-panel p { color: var(--text-secondary); margin-bottom: 3rem; font-size: 1.1rem; }
        .success-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .w-full { width: 100%; }
        @media (max-width: 768px) {
          .workspace { grid-template-columns: 1fr; }
          .options-row { flex-direction: column; }
          .success-actions { flex-direction: column; align-items: center; }
        }
      `}</style>
    </div>
  );
}
