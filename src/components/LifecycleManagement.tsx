import { useState } from "react";
import { useStore } from "../store";
import { LIFECYCLE_STAGES } from "../data/governance";
import { Badge, PageHeader, RoomTabs, statusTone } from "./ui";
import { HeaderButtons } from "./AgentGovernanceHome";

export function LifecycleManagement() {
  const { lifecycle, agents, requestAction, selectAgent } = useStore();
  const [reviewing, setReviewing] = useState(false);
  const inactive = agents.filter((a) => a.status === "Inactive");
  const cards = [
    { n: lifecycle.ownerless, label: "ownerless agents", tone: "bad" },
    { n: lifecycle.inactive, label: "inactive agents", tone: "warn", cta: true },
    { n: lifecycle.awaiting, label: "agents awaiting approval", tone: "blue" },
    { n: lifecycle.expiring, label: "agents approaching policy expiration", tone: "warn" },
    { n: lifecycle.retire, label: "agents recommended for retirement", tone: "mute" },
  ];
  const stageCounts = [520, 502, 495, 491, 487, 487, 463, 12];
  return (
    <>
      <RoomTabs />
      <PageHeader title="Govern the complete agent lifecycle" subtitle="From discovery to retirement, every agent has an owner, a policy and an end date."><HeaderButtons /></PageHeader>
      <div className="stages">
        {LIFECYCLE_STAGES.map((s, i) => (
          <div key={s} className={`stage ${i === 4 ? "current" : ""}`}>
            <span className="stage-n">{i + 1}</span><b>{s}</b><small>{stageCounts[i]}</small>
          </div>
        ))}
      </div>
      <div className="life-grid">
        {cards.map((c) => (
          <div key={c.label} className={`life-card tone-${c.tone}`}>
            <b>{c.n}</b><span>{c.label}</span>
            {c.cta && <button className="btn primary sm" onClick={() => setReviewing((v) => !v)}>{reviewing ? "Hide Inactive Agents" : "Review Inactive Agents"}</button>}
          </div>
        ))}
      </div>
      {reviewing && (
        <section className="inactive-panel">
          <h2 className="h2">Inactive agents</h2>
          <div className="table-wrap">
            <table className="grid">
              <thead><tr><th>Agent</th><th>Room</th><th>Owner</th><th>Last activity</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {inactive.map((a) => (
                  <tr key={a.id}>
                    <td className="strong"><button className="link" onClick={() => selectAgent(a.id)}>{a.name}</button></td>
                    <td>{a.room}</td>
                    <td className={a.owner === "Unassigned" ? "warn-text" : ""}>{a.owner}</td>
                    <td className="muted">{a.lastActivity}</td>
                    <td><Badge tone={statusTone(a.status)}>{a.status}</Badge></td>
                    <td className="row-actions">
                      {a.owner === "Unassigned" && <button className="btn ghost sm" onClick={() => requestAction({ kind: "assign", agentId: a.id, riskId: a.id === "legacy-marketing-agent" ? "risk-legacy" : undefined })}>Assign Owner</button>}
                      <button className="btn ghost sm" onClick={() => requestAction({ kind: "block", agentId: a.id })}>Block</button>
                      <button className="btn ghost sm" onClick={() => requestAction({ kind: "deactivate", agentId: a.id })}>Deactivate</button>
                      <button className="btn danger sm" onClick={() => requestAction({ kind: "retire", agentId: a.id, riskId: a.id === "legacy-marketing-agent" ? "risk-legacy" : undefined })}>Retire</button>
                    </td>
                  </tr>
                ))}
                {inactive.length === 0 && <tr><td colSpan={6} className="empty">No inactive agents remain.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}
