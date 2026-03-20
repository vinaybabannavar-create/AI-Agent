"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

// ─── Types ───────────────────────────────────────────────────────────
export interface ActivityLogEntry {
  id: string;
  timestamp: number;
  type: 'task_completed' | 'task_failed' | 'status_change' | 'info';
  message: string;
}

export interface Agent {
  id: string;
  name: string;
  capability: string;
  description: string;
  status: 'active' | 'processing' | 'paused' | 'error';
  createdAt: number;
  lastActive: number;
  tasksCompleted: number;
  tasksFailed: number;
  successRate: number;
  avgProcessingTime: number; // ms
  speed: 'fast' | 'balanced' | 'thorough';
  priority: 'low' | 'medium' | 'high' | 'critical';
  autoProcess: boolean;
  isDeployed?: boolean;
  deployedAt?: number;
  activityLog: ActivityLogEntry[];
}

export interface ChatMessage {
  id: string;
  agentId: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: number;
}

interface AgentContextType {
  agents: Agent[];
  globalActivityFeed: ActivityLogEntry[];
  createAgent: (config: Partial<Agent>) => Agent;
  deleteAgent: (id: string) => void;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  getAgent: (id: string) => Agent | undefined;
  toggleAgentStatus: (id: string) => void;
  getChatMessages: (agentId: string) => ChatMessage[];
  sendChatMessage: (agentId: string, content: string) => void;
  deployAgent: (id: string) => Promise<void>;
  totalStats: { agents: number; tasks: number; avgSuccess: number };
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

// ─── Helpers ─────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

const TASK_NAMES: Record<string, string[]> = {
  'Document Processing': [
    'Invoice_Q3_2026.pdf', 'Annual_Report.docx', 'Contract_Renewal.pdf',
    'Budget_Summary.xlsx', 'Meeting_Notes.txt', 'Legal_Brief.pdf',
    'Tax_Filing_2026.pdf', 'Employee_Handbook.docx', 'Audit_Report.pdf',
  ],
  'Image Recognition': [
    'product_photo_batch.zip', 'surveillance_feed_03.mp4', 'medical_scan_247.dcm',
    'satellite_imagery.tiff', 'quality_check_line_A.png', 'receipt_scan.jpg',
  ],
  'Structured Data Extraction': [
    'customer_database.csv', 'api_response_log.json', 'web_scrape_results.xml',
    'sensor_readings.parquet', 'survey_responses.xlsx', 'form_submissions.csv',
  ],
};

// Old static responses removed since Gemini API integration handles chat.

// ─── Provider ────────────────────────────────────────────────────────
export const AgentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>({});
  const [globalActivityFeed, setGlobalActivityFeed] = useState<ActivityLogEntry[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('agentData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAgents(parsed.agents || []);
        setChatHistory(parsed.chatHistory || {});
      } catch { /* ignore */ }
    }
    // Migrate old string agents
    const oldAgents = localStorage.getItem('recentAgents');
    if (oldAgents && !saved) {
      try {
        const names: string[] = JSON.parse(oldAgents);
        const migrated: Agent[] = names.map(name => {
          const match = name.match(/^(.+?)\s*\((.+?)\)$/);
          return {
            id: uid(),
            name: match ? match[1] : name,
            capability: match ? match[2] : 'Document Processing',
            description: '',
            status: 'active' as const,
            createdAt: Date.now() - Math.random() * 86400000,
            lastActive: Date.now() - Math.random() * 3600000,
            tasksCompleted: Math.floor(Math.random() * 50) + 5,
            tasksFailed: Math.floor(Math.random() * 5),
            successRate: 85 + Math.random() * 14,
            avgProcessingTime: 800 + Math.random() * 2000,
            speed: 'balanced',
            priority: 'medium',
            autoProcess: true,
            activityLog: [],
          };
        });
        setAgents(migrated);
        localStorage.removeItem('recentAgents');
      } catch { /* ignore */ }
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (agents.length > 0 || Object.keys(chatHistory).length > 0) {
      localStorage.setItem('agentData', JSON.stringify({ agents, chatHistory }));
    }
  }, [agents, chatHistory]);

  // ─── Real-time simulation ──────────────────────────────────────────
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setAgents(prev => {
        const updated = prev.map(agent => {
          if (agent.status !== 'active' || !agent.autoProcess) return agent;
          if (Math.random() > 0.35) return agent; // ~35% chance per tick

          const taskNames = TASK_NAMES[agent.capability] || TASK_NAMES['Document Processing'];
          const taskName = taskNames[Math.floor(Math.random() * taskNames.length)];
          const success = Math.random() > 0.08; // 92% success rate
          const confidence = success ? (75 + Math.random() * 24).toFixed(1) : '—';

          const logEntry: ActivityLogEntry = {
            id: uid(),
            timestamp: Date.now(),
            type: success ? 'task_completed' : 'task_failed',
            message: success
              ? `Processed ${taskName} — ${confidence}% confidence`
              : `Failed to process ${taskName} — retrying...`,
          };

          const newCompleted = agent.tasksCompleted + (success ? 1 : 0);
          const newFailed = agent.tasksFailed + (success ? 0 : 1);
          const total = newCompleted + newFailed;

          setGlobalActivityFeed(feed => {
            const entry: ActivityLogEntry = {
              id: logEntry.id,
              timestamp: logEntry.timestamp,
              type: logEntry.type as 'task_completed' | 'task_failed' | 'status_change' | 'info',
              message: `🤖 ${agent.name}: ${logEntry.message}` as string,
            };
            return [entry, ...feed].slice(0, 50);
          });

          return {
            ...agent,
            lastActive: Date.now(),
            tasksCompleted: newCompleted,
            tasksFailed: newFailed,
            successRate: total > 0 ? (newCompleted / total) * 100 : 100,
            avgProcessingTime: agent.avgProcessingTime + (Math.random() - 0.5) * 100,
            activityLog: [logEntry as ActivityLogEntry, ...agent.activityLog].slice(0, 100),
          };
        });
        return updated;
      });
    }, 4000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // ─── CRUD ──────────────────────────────────────────────────────────
  const createAgent = useCallback((config: Partial<Agent>): Agent => {
    const newAgent: Agent = {
      id: uid(),
      name: config.name || 'Untitled Agent',
      capability: config.capability || 'Document Processing',
      description: config.description || '',
      status: 'active',
      createdAt: Date.now(),
      lastActive: Date.now(),
      tasksCompleted: 0,
      tasksFailed: 0,
      successRate: 100,
      avgProcessingTime: 0,
      speed: config.speed || 'balanced',
      priority: config.priority || 'medium',
      autoProcess: config.autoProcess ?? true,
      activityLog: [{
        id: uid(),
        timestamp: Date.now(),
        type: 'info',
        message: 'Agent initialized and ready for deployment.',
      }],
    };
    setAgents(prev => [newAgent, ...prev]);
    setGlobalActivityFeed(feed => [{
      id: uid(),
      timestamp: Date.now(),
      type: 'info' as 'task_completed' | 'task_failed' | 'status_change' | 'info',
      message: `🚀 New agent "${newAgent.name}" created and deployed!`,
    }, ...feed].slice(0, 50));
    return newAgent;
  }, []);

  const deleteAgent = useCallback((id: string) => {
    setAgents(prev => prev.filter(a => a.id !== id));
    setChatHistory(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const updateAgent = useCallback((id: string, updates: Partial<Agent>) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  }, []);

  const getAgent = useCallback((id: string) => {
    return agents.find(a => a.id === id);
  }, [agents]);

  const toggleAgentStatus = useCallback((id: string) => {
    setAgents(prev => prev.map(a => {
      if (a.id !== id) return a;
      const newStatus = a.status === 'active' ? 'paused' : 'active';
      const logEntry: ActivityLogEntry = {
        id: uid(),
        timestamp: Date.now(),
        type: 'status_change' as const,
        message: newStatus === 'active' ? 'Agent resumed.' : 'Agent paused.',
      };
      return { ...a, status: newStatus, activityLog: [logEntry, ...a.activityLog].slice(0, 100) };
    }));
  }, []);

  // ─── Chat ──────────────────────────────────────────────────────────
  const getChatMessages = useCallback((agentId: string): ChatMessage[] => {
    return chatHistory[agentId] || [];
  }, [chatHistory]);

  const sendChatMessage = useCallback(async (agentId: string, content: string) => {
    const userMsg: ChatMessage = {
      id: uid(),
      agentId,
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setChatHistory(prev => ({
      ...prev,
      [agentId]: [...(prev[agentId] || []), userMsg],
    }));

    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;

    // Get history for the model
    const history = chatHistory[agentId] || [];

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent: {
            name: agent.name,
            capability: agent.capability,
            description: agent.description,
            speed: agent.speed,
            priority: agent.priority,
          },
          message: content,
          history: history,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await res.json();
      
      const agentMsg: ChatMessage = {
        id: uid(),
        agentId,
        role: 'agent',
        content: data.content,
        timestamp: Date.now(),
      };
      
      setChatHistory(prev => ({
        ...prev,
        [agentId]: [...(prev[agentId] || []), agentMsg],
      }));
      
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg: ChatMessage = {
        id: uid(),
        agentId,
        role: 'agent',
        content: "⚠️ I'm having trouble connecting to my neural core right now. Please ensure my Gemini API configuration is set up correctly on the backend.",
        timestamp: Date.now(),
      };
      
      setChatHistory(prev => ({
        ...prev,
        [agentId]: [...(prev[agentId] || []), errorMsg],
      }));
    }
  }, [agents, chatHistory]);

  const deployAgent = useCallback(async (id: string) => {
    // Simulate deployment process
    updateAgent(id, { status: 'processing' });
    
    // Artificial delay for "Fast Deployment" simulation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setAgents(prev => prev.map(a => a.id === id ? { 
      ...a, 
      isDeployed: true, 
      deployedAt: Date.now(),
      status: 'active'
    } : a));

    setGlobalActivityFeed(prev => [{
      id: uid(),
      timestamp: Date.now(),
      type: 'info' as const,
      message: `🌐 Agent "${agents.find(a => a.id === id)?.name}" is now LIVE!`,
    }, ...prev].slice(0, 50));
  }, [agents, updateAgent]);

  // ─── Stats ─────────────────────────────────────────────────────────
  const totalStats = {
    agents: agents.length,
    tasks: agents.reduce((sum, a) => sum + a.tasksCompleted, 0),
    avgSuccess: agents.length > 0
      ? agents.reduce((sum, a) => sum + a.successRate, 0) / agents.length
      : 0,
  };

  return (
    <AgentContext.Provider value={{
      agents, globalActivityFeed, createAgent, deleteAgent,
      updateAgent, getAgent, toggleAgentStatus,
      getChatMessages, sendChatMessage, deployAgent, totalStats,
    }}>
      {children}
    </AgentContext.Provider>
  );
};

export const useAgents = () => {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error('useAgents must be used within AgentProvider');
  return ctx;
};
