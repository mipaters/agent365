import { useStore } from "../store";
import { POLICY_KEYS } from "../data/agents";
import { Badge, PermBadge, riskTone, statusTone } from "./ui";

export function AgentDetailPanel() {
  const { selectedAgentId, selectAgent, agentById, requestAction, navigate, setAuditAgentFilter, setMapSelected } = useStore();
  const a = selectedAgentId ? agentById(selectedAgentId) : undefined;
  if (!a) return null;
  const connected = a.connectedAgents.map((id) => agentById(id)).filter(Boolean);
  const violations = POLICY_KEYS.filter((k) => !a.policies[k]).length;
  return (
    <aside className="panel" role="complementary" aria-label={`${a.name} details`}>
      <div className="panel-head">
        <div>
          <h2>{a.name}</h2>
          <div className="muted">{a.room} Room · {a.platform}</div>
        </div>
        <button className="icon-btn" onClick={() => selectAgent(null)} aria-label="Close">✕</button>
      </div>
      <div className="panel-body">
        <div className="score-row">
          <div className={`score tone-${riskTone(a.risk)}`}><b>{a.riskScore}</b><span>Risk score</span></div>
          <Badge tone={riskTone(a.risk)}>{a.risk} risk</Badge>
          <Badge tone={statusTone(a.status)}>{a.status}</Badge>
        </div>
        <dl className="facts">
          <dt>Business owner</dt><dd className={a.owner === "Unassigned" ? "warn-text" : ""}>{a.owner}</dd>
          <dt>Technical owner</dt><dd>{a.techOwner}</dd>
          <dt>Platform</dt><dd>{a.platform}</dd>
          <dt>Agent identity</dt><dd className="mono">{a.agentIdentity} <Badge tone={a.identity === "Managed" ? "good" : "warn"}>{a.identity}</Badge></dd>
          <dt>Created</dt><dd>{a.created}</dd>
          <dt>Last activity</dt><dd>{a.lastActivity}</dd>
        </dl>

        <h3>Permissions</h3>
        <ul className="perm-list">
          {a.permissions.map((p) => (
            <li key={p.system}><span>{p.system}</span><span className="perm-badges">{p.perms.map((x) => <PermBadge key={x} p={x} />)}</span></li>
          ))}
        </ul>

        <h3>Connected Agents</h3>
        <div className="chip-wrap">
          {connected.length === 0 && <span className="muted">No agent-to-agent connections</span>}
          {connected.map((c) => <button key={c!.id} className="agent-chip" onClick={() => selectAgent(c!.id)}><i className={`dot d-${riskTone(c!.risk)}`} />{c!.name}</button>)}
        </div>

        <h3>Connected Tools</h3>
        <ul className="tool-list">
          {a.tools.map((t) => <li key={t.name}><span className="tool-kind">{t.kind}</span>{t.name}</li>)}
        </ul>

        <h3>Governance Policies <span className="muted">{POLICY_KEYS.length - violations}/{POLICY_KEYS.length}</span></h3>
        <ul className="policy-list">
          {POLICY_KEYS.map((k) => <li key={k} className={a.policies[k] ? "ok" : "fail"}><i>{a.policies[k] ? "✓" : "!"}</i>{k}</li>)}
        </ul>

        <div className="panel-actions">
          <button className="btn ghost sm" onClick={() => { setMapSelected(a.id); navigate("map"); }}>View in Agent Map</button>
          <button className="btn ghost sm" onClick={() => { setAuditAgentFilter(a.id); navigate("audit"); }}>View Audit Trail</button>
          {a.status !== "Retired" && a.status !== "Suspended" && <button className="btn danger sm" onClick={() => requestAction({ kind: "suspend", agentId: a.id })}>Suspend Agent</button>}
        </div>
      </div>
    </aside>
  );
}
