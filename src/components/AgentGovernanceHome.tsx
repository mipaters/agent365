import { useStore } from "../store";
import { ROOMS, ROOM_COLORS, ROOM_META } from "../data/agents";
import { Kpi, PageHeader, RoomTabs, Badge, riskTone, statusTone } from "./ui";
import { ArchitectureLayer } from "./ArchitectureLayer";
import type { Room, View } from "../types";

export function HeaderButtons() {
  const { setWalkthroughStep, setWizardOpen } = useStore();
  return (
    <>
      <button className="btn ghost" onClick={() => setWizardOpen(true)}>＋ Register New Agent</button>
      <button className="btn primary" onClick={() => setWalkthroughStep(0)}>▶ Start Executive Walkthrough</button>
    </>
  );
}

export function AgentGovernanceHome() {
  const { navigate, selectAgent, agents, activeAgents, attention, compliance, setAuditAgentFilter } = useStore();
  void setAuditAgentFilter;
  return (
    <>
      <RoomTabs />
      <PageHeader title="Agentic Governance Command Center" subtitle="Observe, govern and secure the digital workforce across the enterprise.">
        <HeaderButtons />
      </PageHeader>
      <div className="section-label">Enterprise Agent Estate</div>
      <div className="kpi-row">
        <Kpi value={activeAgents} label="Active Agents" tip="Agents discovered and registered across all platforms" onClick={() => navigate("registry")} />
        <Kpi value={8} label="Business Domains" tip="Consumer, Business, Customer Care, Network Ops, IT, Finance, Media & Sports, Field Ops" />
        <Kpi value={6} label="Agent Platforms" tip="Microsoft and third-party agent platforms" onClick={() => navigate("registry")} />
        <Kpi value={attention} tone={attention > 8 ? "warn" : "good"} label="Agents Requiring Attention" tip="Open risk items. Click to open the risk queue" onClick={() => navigate("risk")} />
        <Kpi value={compliance} suffix="%" tone="good" label="Policy Compliance" tip="Agents compliant with enterprise governance policy" />
        <Kpi value={38.4} decimals={1} prefix="$" suffix="M" label="Annualized Business Impact" tip="Illustrative demo metric" onClick={() => navigate("impact")} />
      </div>

      <h2 className="h2">Agent Estate by Room</h2>
      <div className="room-grid">
        {ROOMS.map((r) => <RoomTile key={r} room={r} agents={agents} onOpen={(id) => selectAgent(id)} onRoom={() => navigate(`room:${r}` as View)} />)}
      </div>
      <p className="footnote">Representative demo agents and synthetic data. Not actual deployed agents.</p>

      <h2 className="h2">One control plane across every room</h2>
      <ArchitectureLayer />
    </>
  );
}

function RoomTile({ room, agents, onOpen, onRoom }: { room: Room; agents: ReturnType<typeof useStore>["agents"]; onOpen: (id: string) => void; onRoom: () => void }) {
  const m = ROOM_META[room];
  const sample = agents.filter((a) => a.room === room && a.status !== "Retired").slice(0, 5);
  const tone = m.tone;
  return (
    <div className="room-tile" style={{ ["--c" as string]: ROOM_COLORS[room] }}>
      <button className="room-tile-head" onClick={onRoom} data-tip={`Open ${room} room`}>
        <span className="room-name">{room}</span>
        <span className="room-count">{m.agents}<small> agents</small></span>
      </button>
      <div className="health"><i style={{ width: `${m.healthy}%` }} className={`h-${tone}`} /></div>
      <div className="room-status">
        <Badge tone={tone}>{m.attention} need attention</Badge>
        <span className="muted">{m.healthy}% healthy</span>
      </div>
      <ul className="chip-list">
        {sample.map((a) => (
          <li key={a.id}>
            <button className="agent-chip" onClick={() => onOpen(a.id)} data-tip={`${a.platform} · ${a.risk} risk`}>
              <i className={`dot d-${riskTone(a.risk)}`} />{a.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RoomView({ room }: { room: Room }) {
  const { agents, selectAgent, navigate } = useStore();
  const m = ROOM_META[room];
  const list = agents.filter((a) => a.room === room);
  return (
    <>
      <RoomTabs />
      <PageHeader eyebrow="Telco Rooms of the House" title={`${room} Room`} subtitle="Every room can create agents. Agent 365 governs the house.">
        <button className="btn primary" onClick={() => navigate("command")}>Open Governance Command Center</button>
      </PageHeader>
      <div className="kpi-row four">
        <Kpi value={m.agents} label={`${room} agents`} />
        <Kpi value={m.healthy} suffix="%" tone="good" label="Healthy" />
        <Kpi value={m.attention} tone={m.tone === "good" ? "good" : "warn"} label="Need attention" onClick={() => navigate("risk")} />
        <Kpi value={new Set(list.map((a) => a.platform)).size} label="Platforms (sample)" />
      </div>
      <h2 className="h2">Governed agents in this room</h2>
      <div className="table-wrap">
        <table className="grid">
          <thead><tr><th>Agent</th><th>Platform</th><th>Owner</th><th>Risk</th><th>Status</th></tr></thead>
          <tbody>
            {list.map((a) => (
              <tr key={a.id} onClick={() => selectAgent(a.id)}>
                <td className="strong">{a.name}</td><td>{a.platform}</td><td>{a.owner}</td>
                <td><Badge tone={riskTone(a.risk)}>{a.risk}</Badge></td>
                <td><Badge tone={statusTone(a.status)}>{a.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function HomeView() {
  const { navigate, setWalkthroughStep } = useStore();
  return (
    <>
      <PageHeader eyebrow="Telco Rooms of the House" title="Every room is becoming agentic" subtitle="Agent 365 gives the enterprise one control plane to discover, govern, secure and manage that digital workforce.">
        <button className="btn primary" onClick={() => setWalkthroughStep(0)}>▶ Start Executive Walkthrough</button>
        <button className="btn ghost" onClick={() => navigate("command")}>Enter Agentic Governance</button>
      </PageHeader>
      <ArchitectureLayer />
    </>
  );
}
