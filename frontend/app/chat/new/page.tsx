"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewAgentPage() {
  const router = useRouter();
  const [agentName, setAgentName] = useState("");
  const [capability, setCapability] = useState("Document Processing");
  const [isInitializing, setIsInitializing] = useState(false);
  const [initStatus, setInitStatus] = useState("System Standby");
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>(["[SYSTEM] Standing by for initialization..."]);

  const handleInitialize = () => {
    if (!agentName) {
      alert("Please enter an agent name");
      return;
    }
    setIsInitializing(true);
    setInitStatus("Neural Allocation Started");
    setLogs(prev => [...prev, `[INIT] Starting builder for: ${agentName}`, "[CORE] Allocating cognitive resources..."]);

    const stages = [
      { text: "Configuring Core Logic...", log: "[CORE] Logic patterns optimized.", delay: 1000 },
      { text: "Optimizing Capability: " + capability + "...", log: `[MODULE] ${capability} integration complete.`, delay: 2000 },
      { text: "Securing Encrypted Channels...", log: "[AUTH] Security layer 7 established.", delay: 3000 },
      { text: "Optimizing Synapses...", log: "[NEURAL] Weights adjusted for peak performance.", delay: 4000 },
      { text: "Agent Online: " + agentName + " Ready!", log: "[SYSTEM] Deployment successful. Agent is live.", delay: 5000 }
    ];

    stages.forEach((stage, index) => {
      setTimeout(() => {
        setInitStatus(stage.text);
        setLogs(prev => [...prev.slice(-4), stage.log]);
        setProgress((index + 1) * 20);

        if (index === stages.length - 1) {
          // Final stage - save agent and redirect
          setTimeout(() => {
            // Save agent to localStorage
            const existingAgents = localStorage.getItem('recentAgents');
            const agents = existingAgents ? JSON.parse(existingAgents) : [];
            agents.unshift(`${agentName} (${capability})`);
            // Keep only last 5 agents
            if (agents.length > 5) agents.pop();
            localStorage.setItem('recentAgents', JSON.stringify(agents));

            alert(`✓ Agent "${agentName}" successfully created!\n\nRedirecting to dashboard...`);
            setIsInitializing(false);
            router.push("/dashboard");
          }, 800);
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
              <button
                onClick={handleInitialize}
                className={`btn-premium w-full ${isInitializing ? 'loading' : ''}`}
                disabled={isInitializing}
              >
                {isInitializing ? "Initializing..." : "Initialize Agent"}
              </button>
            </div>

            <div className="preview-panel glass">
              <div className="placeholder-content">
                <div className={`status-icon ${isInitializing ? 'pulse' : ''}`}>
                  {isInitializing ? "⚡" : "🤖"}
                </div>
                <div className="live-log-container glass-inset">
                  <div className="log-header">NEURAL FEED v1.0</div>
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
        </div>
      </div>

      <style jsx>{`
        .builder-container {
          padding: 4rem 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }
        .builder-card {
          padding: 3rem;
        }
        .back-link {
          display: block;
          text-align: left;
          color: var(--text-secondary);
          text-decoration: none;
          margin-bottom: 2rem;
          font-size: 0.9rem;
        }
        .builder-title {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        .builder-subtitle {
          color: var(--text-secondary);
          margin-bottom: 3rem;
        }
        .workspace {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 2rem;
          padding: 2rem;
          border-radius: 20px;
        }
        .input-group {
          margin-bottom: 1.5rem;
          text-align: left;
        }
        .input-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .glass-select {
          width: 100%;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          appearance: none;
        }
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
           padding: 2rem;
        }
        .status-icon {
          font-size: 3.5rem;
          margin-bottom: 1.5rem;
          filter: drop-shadow(0 0 15px var(--accent-primary));
        }
        .pulse {
          animation: status-pulse 1.5s infinite;
        }
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
          font-size: 1.1rem;
          letter-spacing: 0.5px;
        }
        .progress-bar-container {
          width: 100%;
          max-width: 300px;
          height: 6px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          margin: 1.5rem auto 0;
          overflow: hidden;
        }
        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
          transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .w-full { width: 100%; }
        @media (max-width: 768px) {
          .workspace { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
