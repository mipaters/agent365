import { useMemo, useState } from "react";
import { useStore } from "../store";
import { PLATFORMS, ROOMS } from "../data/agents";
import { Badge, PageHeader, RoomTabs, riskTone, statusTone } from "./ui";
import { HeaderButtons } from "./AgentGovernanceHome";

export function AgentRegistry() {
  const { agents, selectAgent, selectedAgentId } = useStore();
  const [q, setQ] = useState("");
  const [room, setRoom] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [risk, setRisk] = useState("all");
  const [status, setStatus] = useState("all");
  const [owner, setOwner] = useState("all");

  const owners = useMemo(() => [...new Set(agents.map((a) => a.owner))].sort(), [agents]);
  const rows = agents.filter((a) =>
    (room === "all" || a.room === room) &&
    (platform === "all" || a.platform === platform) &&
    (risk === "all" || a.risk === risk) &&
    (status === "all" || a.status === status) &&
    (owner === "all" || a.owner === owner) &&
    (q === "" || `${a.name} ${a.data} ${a.owner} ${a.platform}`.toLowerCase().includes(q.toLowerCase())),
  );
  const reset = () => { setQ(""); setRoom("all"); setPlatform("all"); setRisk("all"); setStatus("all"); setOwner("all"); };
  const sel = (v: string, set: (s: string) => void, label: string, opts: string[]) => (
    <select value={v} onChange={(e) => set(e.target.value)} aria-label={label}>
      <option value="all">{label}: All</option>
      {opts.map((o) => <option key={o}>{o}</option>)}
    </select>
  );

  return (
    <>
      <RoomTabs />
      <PageHeader title="Every agent. One registry." subtitle="A complete inventory of the enterprise digital workforce."><HeaderButtons /></PageHeader>
      <div className="filters">
        <input className="search" placeholder="Search agents, owners, data…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search agents" />
        {sel(room, setRoom, "Room", ROOMS)}
        {sel(platform, setPlatform, "Platform", PLATFORMS)}
        {sel(risk, setRisk, "Risk", ["Low", "Medium", "High", "Critical"])}
        {sel(status, setStatus, "Status", ["Active", "Review", "Inactive", "Pending Approval", "Suspended", "Blocked", "Retired"])}
        {sel(owner, setOwner, "Owner", owners)}
        <button className="btn ghost sm" onClick={reset}>Reset</button>
      </div>
      <div className="table-wrap">
        <table className="grid">
          <thead>
            <tr><th>Agent</th><th>Business Domain</th><th>Platform</th><th>Owner</th><th>Identity</th><th>Data Access</th><th>Risk</th><th>Status</th><th>Last Activity</th></tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id} className={selectedAgentId === a.id ? "selected" : ""} onClick={() => selectAgent(a.id)} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && selectAgent(a.id)}>
                <td className="strong">{a.name}</td>
                <td>{a.room}</td>
                <td>{a.platform}</td>
                <td className={a.owner === "Unassigned" ? "warn-text" : ""}>{a.owner}</td>
                <td><Badge tone={a.identity === "Managed" ? "good" : a.identity === "Unmanaged" ? "bad" : "warn"}>{a.identity}</Badge></td>
                <td>{a.data}</td>
                <td><Badge tone={riskTone(a.risk)}>{a.risk}</Badge></td>
                <td><Badge tone={statusTone(a.status)}>{a.status}</Badge></td>
                <td className="muted">{a.lastActivity}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={9} className="empty">No agents match these filters.</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="footnote">Showing {rows.length} of {agents.length} representative agents from the 487-agent synthetic estate.</p>
    </>
  );
}
