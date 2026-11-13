import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ActionKind, Agent, AuditEvent, Perm, View } from "./types";
import { buildAgents, buildVendorAgent, VENDOR_AGENT_ID } from "./data/agents";
import { AUDIT_EVENTS, BASE, RISK_ITEMS } from "./data/governance";

export interface Pending {
  kind: ActionKind;
  agentId: string;
  riskId?: string;
}

export const RESTRICT_TARGET: Record<string, { system: string; perm: Perm }> = {
  "developer-agent": { system: "GitHub", perm: "ADMIN" },
  "service-desk-agent": { system: "ServiceNow", perm: "EXECUTE" },
  "marketing-campaign-agent": { system: "Audience Analytics", perm: "WRITE" },
};

interface Store {
  view: View;
  navigate: (v: View) => void;
  agents: Agent[];
  agentById: (id: string) => Agent | undefined;
  selectedAgentId: string | null;
  selectAgent: (id: string | null) => void;
  audit: AuditEvent[];
  auditAgentFilter: string;
  setAuditAgentFilter: (id: string) => void;
  resolved: Record<string, string>;
  attention: number;
  severity: { Critical: number; High: number; Medium: number };
  compliance: number;
  activeAgents: number;
  lifecycle: typeof BASE.lifecycle;
  pending: Pending | null;
  requestAction: (p: Pending | null) => void;
  commit: (p: Pending) => void;
  wizardOpen: boolean;
  setWizardOpen: (b: boolean) => void;
  registerVendorAgent: () => void;
  walkthroughStep: number | null;
  setWalkthroughStep: (n: number | null) => void;
  mapSelected: string | null;
  setMapSelected: (id: string | null) => void;
}

const Ctx = createContext<Store | null>(null);
export const useStore = () => {
  const s = useContext(Ctx);
  if (!s) throw new Error("StoreProvider missing");
  return s;
};

const SS_KEY = "agentic-governance-state";
const loadNav = (): { view: View; step: number | null } => {
  const hash = window.location.hash.slice(1);
  if (hash) return { view: hash as View, step: null };
  try {
    const raw = sessionStorage.getItem(SS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return { view: "command", step: null };
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const initial = useMemo(loadNav, []);
  const [view, setView] = useState<View>(initial.view);
  const [agents, setAgents] = useState<Agent[]>(buildAgents);
  const [selectedAgentId, selectAgent] = useState<string | null>(null);
  const [dynamicAudit, setDynamicAudit] = useState<AuditEvent[]>([]);
  const [auditAgentFilter, setAuditAgentFilter] = useState("all");
  const [resolved, setResolved] = useState<Record<string, string>>({});
  const [lifecycle, setLifecycle] = useState({ ...BASE.lifecycle });
  const [pending, requestAction] = useState<Pending | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [vendorAdded, setVendorAdded] = useState(false);
  const [walkthroughStep, setWalkthroughStep] = useState<number | null>(initial.step);
  const [mapSelected, setMapSelected] = useState<string | null>(null);

  useEffect(() => {
    sessionStorage.setItem(SS_KEY, JSON.stringify({ view, step: walkthroughStep }));
  }, [view, walkthroughStep]);

  const navigate = useCallback((v: View) => {
    setView(v);
    selectAgent(null);
  }, []);

  const agentById = useCallback((id: string) => agents.find((a) => a.id === id), [agents]);

  const logAudit = useCallback((e: Omit<AuditEvent, "id" | "time">) => {
    setDynamicAudit((prev) => {
      const n = prev.length;
      return [{ ...e, id: `dyn-${n}`, time: `09:${String(42 + n).padStart(2, "0")}` }, ...prev];
    });
  }, []);

  const commit = useCallback(
    (p: Pending) => {
      const agent = agents.find((a) => a.id === p.agentId);
      if (!agent) return;
      const patch: Partial<Agent> = {};
      let action = "";
      let resource = agent.name;
      let policy = "Governance Action";
      switch (p.kind) {
        case "restrict": {
          const t = RESTRICT_TARGET[agent.id] ?? { system: agent.permissions[0].system, perm: "ADMIN" as Perm };
          patch.permissions = agent.permissions.map((x) =>
            x.system === t.system ? { ...x, perms: x.perms.filter((q) => q !== t.perm) } : x,
          );
          patch.risk = "Low";
          patch.riskScore = 18;
          patch.status = "Active";
          patch.policies = { ...agent.policies, "Least privilege policy": true };
          action = `${t.perm} permission removed by administrator`;
          resource = t.system;
          policy = "Least Privilege Policy";
          break;
        }
        case "block":
          patch.status = "Blocked";
          action = "Agent blocked by administrator";
          break;
        case "suspend":
          patch.status = "Suspended";
          action = "Agent suspended by administrator";
          break;
        case "assign":
          patch.owner = "Marketing Operations";
          patch.techOwner = "D. Gagnon";
          patch.risk = "Low";
          patch.riskScore = 22;
          patch.policies = { ...agent.policies, "Owner assigned": true, "Identity verified": true };
          action = "Owner assigned: Marketing Operations";
          policy = "Ownership Policy";
          setLifecycle((l) => ({ ...l, ownerless: l.ownerless - 1 }));
          break;
        case "retire":
          patch.status = "Retired";
          action = "Agent retired and access revoked";
          policy = "Lifecycle Policy";
          setLifecycle((l) => ({
            ...l,
            inactive: agent.status === "Inactive" ? l.inactive - 1 : l.inactive,
            ownerless: agent.owner === "Unassigned" ? l.ownerless - 1 : l.ownerless,
          }));
          break;
        case "deactivate":
          patch.status = "Inactive";
          action = "Agent deactivated";
          policy = "Lifecycle Policy";
          break;
      }
      setAgents((prev) => prev.map((a) => (a.id === agent.id ? { ...a, ...patch } : a)));
      logAudit({ agentId: agent.id, action, resource, policy, decision: "Logged", user: "Admin: S. Marchand", severity: "None" });
      if (p.riskId) setResolved((r) => ({ ...r, [p.riskId!]: p.kind }));
    },
    [agents, logAudit],
  );

  const registerVendorAgent = useCallback(() => {
    if (vendorAdded) return;
    setVendorAdded(true);
    setAgents((prev) => [buildVendorAgent(), ...prev]);
    logAudit({ agentId: VENDOR_AGENT_ID, action: "Agent registered and approved for production", resource: "Agent registry", policy: "Standard Network Agent Policy", decision: "Logged", user: "Admin: S. Marchand", severity: "None" });
  }, [vendorAdded, logAudit]);

  const resolvedItems = RISK_ITEMS.filter((r) => resolved[r.id]);
  const severity = { ...BASE.severity };
  resolvedItems.forEach((r) => (severity[r.severity] -= 1));
  const attention = BASE.attention - resolvedItems.length;
  const compliance = BASE.compliance + Math.min(resolvedItems.length, 2);

  const value: Store = {
    view, navigate, agents, agentById, selectedAgentId, selectAgent,
    audit: [...dynamicAudit, ...AUDIT_EVENTS], auditAgentFilter, setAuditAgentFilter,
    resolved, attention, severity, compliance,
    activeAgents: BASE.agents + (vendorAdded ? 1 : 0),
    lifecycle, pending, requestAction, commit,
    wizardOpen, setWizardOpen, registerVendorAgent,
    walkthroughStep, setWalkthroughStep, mapSelected, setMapSelected,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
