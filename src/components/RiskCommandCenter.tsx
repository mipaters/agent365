import { useStore } from "../store";
import { RISK_ITEMS } from "../data/governance";
import { Kpi, PageHeader, RoomTabs, Badge, riskTone } from "./ui";
import { HeaderButtons } from "./AgentGovernanceHome";
import type { RiskItem } from "../types";

export function RiskCard({ item }: { item: RiskItem }) {
  const { agentById, resolved, selectAgent, requestAction, navigate, setAuditAgentFilter } = useStore();
  const agent = agentById(item.agentId);
  if (!agent) return null;
  const done = resolved[item.id];
  const run = (kind: RiskItem["actions"][number]["kind"]) => {
    if (kind === "review") selectAgent(agent.id);
    else if (kind === "investigate" || kind === "audit") { setAuditAgentFilter(agent.id); navigate("audit"); }
    else requestAction({ kind, agentId: agent.id, riskId: item.id });
  };
  return (
    <article className={`risk-card sev-${item.severity.toLowerCase()} ${done ? "resolved" : ""}`} id={item.id}>
      <header>
        <div>
          <button className="link" onClick={() => selectAgent(agent.id)}>{agent.name}</button>
          <div className="muted">{agent.room} · {agent.platform}</div>
        </div>
        {done ? <Badge tone="good">✓ Resolved</Badge> : <Badge tone={item.severity === "Medium" ? "warn" : "bad"}>{item.severity.toUpperCase()} RISK</Badge>}
      </header>
      <div className="issue"><span className="muted">Issue</span><strong>{item.issue}</strong></div>
      <ul className="risk-facts">
        {item.facts.map((f) => <li key={f.label}><span className="muted">{f.label}</span><span className={f.tone ? `t-${f.tone}` : ""}>{f.label === "Current access" && done && agent.id === "developer-agent" ? "READ / WRITE" : f.value}</span></li>)}
      </ul>
      <div className="reco"><span className="muted">Recommendation</span> {item.recommendation}</div>
      {done ? (
        <div className="resolved-line">Risk {agent.risk.toUpperCase()} · action logged in the audit trail</div>
      ) : (
        <div className="risk-actions">
          {item.actions.map((a) => (
            <button key={a.label} className={`btn sm ${a.kind === "restrict" || a.kind === "assign" ? "primary" : a.kind === "suspend" || a.kind === "block" || a.kind === "retire" ? "danger" : "ghost"}`} onClick={() => run(a.kind)}>{a.label}</button>
          ))}
        </div>
      )}
    </article>
  );
}

export function RiskCommandCenter() {
  const { attention, severity, resolved } = useStore();
  const open = RISK_ITEMS.filter((r) => !resolved[r.id]);
  const closed = RISK_ITEMS.filter((r) => resolved[r.id]);
  void riskTone;
  return (
    <>
      <RoomTabs />
      <PageHeader title="Agent Risk Command Center" subtitle="Prioritized risks across every agent, with one-click remediation."><HeaderButtons /></PageHeader>
      <div className="kpi-row four">
        <Kpi value={attention} tone={attention > 8 ? "warn" : "good"} label="Agents Requiring Attention" />
        <Kpi value={severity.Critical} tone="bad" label="Critical" />
        <Kpi value={severity.High} tone="warn" label="High" />
        <Kpi value={severity.Medium} tone="blue" label="Medium" />
      </div>
      <h2 className="h2">Prioritized risk queue</h2>
      <div className="risk-grid">
        {open.map((r) => <RiskCard key={r.id} item={r} />)}
        {closed.map((r) => <RiskCard key={r.id} item={r} />)}
      </div>
      <p className="footnote">Top {RISK_ITEMS.length} of {attention} open items shown. Remaining items are lower-priority and follow the same workflow.</p>
    </>
  );
}
