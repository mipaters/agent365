import { useMemo, useState } from "react";
import { useStore } from "../store";
import { ROOMS } from "../data/agents";
import { Badge, PageHeader, RoomTabs } from "./ui";
import { HeaderButtons } from "./AgentGovernanceHome";

export function AuditTrail() {
  const { audit, agentById, agents, auditAgentFilter, setAuditAgentFilter } = useStore();
  const [domain, setDomain] = useState("all");
  const [policy, setPolicy] = useState("all");
  const [decision, setDecision] = useState("all");
  const [severity, setSeverity] = useState("all");

  const policies = useMemo(() => [...new Set(audit.map((e) => e.policy))].sort(), [audit]);
  const rows = audit.filter((e) => {
    const a = agentById(e.agentId);
    return (auditAgentFilter === "all" || e.agentId === auditAgentFilter) &&
      (domain === "all" || a?.room === domain) &&
      (policy === "all" || e.policy === policy) &&
      (decision === "all" || e.decision === decision) &&
      (severity === "all" || e.severity === severity);
  });
  const agentIds = [...new Set(audit.map((e) => e.agentId))];

  return (
    <>
      <RoomTabs />
      <PageHeader title="Every agent action is traceable" subtitle="A chronological, policy-aware activity trail across the digital workforce."><HeaderButtons /></PageHeader>
      <div className="filters">
        <select value={auditAgentFilter} onChange={(e) => setAuditAgentFilter(e.target.value)} aria-label="Agent">
          <option value="all">Agent: All</option>
          {agentIds.map((id) => <option key={id} value={id}>{agents.find((a) => a.id === id)?.name ?? id}</option>)}
        </select>
        <select value={domain} onChange={(e) => setDomain(e.target.value)} aria-label="Domain"><option value="all">Domain: All</option>{ROOMS.map((r) => <option key={r}>{r}</option>)}</select>
        <select value={policy} onChange={(e) => setPolicy(e.target.value)} aria-label="Policy"><option value="all">Policy: All</option>{policies.map((p) => <option key={p}>{p}</option>)}</select>
        <select value={decision} onChange={(e) => setDecision(e.target.value)} aria-label="Decision"><option value="all">Decision: All</option><option>Allowed</option><option>Blocked</option><option>Logged</option></select>
        <select value={severity} onChange={(e) => setSeverity(e.target.value)} aria-label="Severity"><option value="all">Severity: All</option><option>Critical</option><option>High</option><option>Medium</option><option>None</option></select>
        <button className="btn ghost sm" onClick={() => { setAuditAgentFilter("all"); setDomain("all"); setPolicy("all"); setDecision("all"); setSeverity("all"); }}>Reset</button>
      </div>
      <ol className="timeline">
        {rows.map((e) => {
          const a = agentById(e.agentId);
          return (
            <li key={e.id} className={`ev d-${e.decision.toLowerCase()}`}>
              <time>{e.time}</time>
              <div className="ev-body">
                <div className="ev-title"><b>{a?.name ?? e.agentId}</b> — {e.action}</div>
                <div className="ev-meta">
                  <span>Resource: {e.resource}</span><span>Policy: {e.policy}</span><span>User: {e.user}</span>
                  <Badge tone={e.decision === "Allowed" ? "good" : e.decision === "Blocked" ? "bad" : "blue"}>{e.decision}</Badge>
                  {e.severity !== "None" && <Badge tone={e.severity === "Medium" ? "warn" : "bad"}>{e.severity}</Badge>}
                </div>
              </div>
            </li>
          );
        })}
        {rows.length === 0 && <li className="empty">No events match these filters.</li>}
      </ol>
    </>
  );
}
