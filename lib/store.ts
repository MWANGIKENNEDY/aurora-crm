import { create } from "zustand";

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  status: string;
  phone?: string;
  source: string;
  lastContacted?: string;
  owner: string;
  notes?: string;
  createdAt: string;
  dealSize?: number;
}

export interface PipelineStage {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface List {
  id: string;
  name: string;
  leadIds: string[];
  createdAt: string;
  notes?: string;
}

interface AppState {
  leads: Lead[];
  pipelineStages: PipelineStage[];
  lists: List[];
  currentUser: { id: string; name: string; email: string } | null;
  theme: "light" | "dark" | "auto";
  
  // Actions
  setLeads: (leads: Lead[]) => void;
  addLead: (lead: Lead) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  setPipelineStages: (stages: PipelineStage[]) => void;
  moveLeadToStage: (leadId: string, stageId: string) => void;
  setLists: (lists: List[]) => void;
  addList: (list: List) => void;
  setCurrentUser: (user: { id: string; name: string; email: string } | null) => void;
  setTheme: (theme: "light" | "dark" | "auto") => void;
}

export const useStore = create<AppState>((set) => ({
  leads: [],
  pipelineStages: [
    { id: "1", name: "New", color: "#94a3b8", order: 0 },
    { id: "2", name: "Contacted", color: "#60a5fa", order: 1 },
    { id: "3", name: "Qualified", color: "#a78bfa", order: 2 },
    { id: "4", name: "Proposal", color: "#fbbf24", order: 3 },
    { id: "5", name: "Won", color: "#34d399", order: 4 },
    { id: "6", name: "Lost", color: "#f87171", order: 5 },
  ],
  lists: [],
  currentUser: null,
  theme: "auto",

  setLeads: (leads) => set({ leads }),
  addLead: (lead) => set((state) => ({ leads: [lead, ...state.leads] })),
  updateLead: (id, updates) =>
    set((state) => ({
      leads: state.leads.map((lead) =>
        lead.id === id ? { ...lead, ...updates } : lead
      ),
    })),
  deleteLead: (id) =>
    set((state) => ({
      leads: state.leads.filter((lead) => lead.id !== id),
    })),
  setPipelineStages: (stages) => set({ pipelineStages: stages }),
  moveLeadToStage: (leadId, stageId) =>
    set((state) => ({
      leads: state.leads.map((lead) =>
        lead.id === leadId ? { ...lead, status: stageId } : lead
      ),
    })),
  setLists: (lists) => set({ lists }),
  addList: (list) => set((state) => ({ lists: [...state.lists, list] })),
  setCurrentUser: (user) => set({ currentUser: user }),
  setTheme: (theme) => set({ theme }),
}));

