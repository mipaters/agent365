import { useStore } from "../store";
import { ROOMS, ROOM_COLORS } from "../data/agents";
import { IMPACT_BY_ROOM } from "../data/governance";
import { Kpi, PageHeader, RoomTabs, Badge } from "./ui";
import { HeaderButtons } from "./AgentGovernanceHome";
import type { View } from "../types";

export function BusinessImpact() {
  const { activeAgents, compliance, navigate } = useStore();
  const max = 143;
  return (
    <>
      <RoomTabs />
      <PageHeader title="Manage agents like a digital workforce" subtitle="Productivity, risk posture and compliance across every room."><HeaderButtons /></PageHeader>
      <div className="kpi-row">
        <Kpi value={activeAgents} label="Active Agents" />
        <Kpi value={288450} label="Tasks Completed" />
        <Kpi value={94} suffix="%" tone="good" label="Successful Task Completion" />
        <Kpi value={12.4} decimals={1} suffix="M" label="Employee Minutes Returned" />
        <Kpi value={38.4} decimals={1} prefix="$" suffix="M" label="Annualized Business Impact" />
        <Kpi value={compliance} suffix="%" tone="good" label="Policy Compliance" />
      </div>
      <p className="footnote strong-note">Illustrative demo metrics</p>
      <h2 className="h2">Impact by room</h2>
      <div className="impact-grid">
        {ROOMS.map((r) => {
          const m = IMPACT_BY_ROOM[r];
          const t = parseInt(m.tasks, 10);
          return (
            <div key={r} className="impact-card" style={{ ["--c" as string]: ROOM_COLORS[r] }}>
              <header><button className="link" onClick={() => navigate(`room:${r}` as View)}>{r.toUpperCase()}</button><Badge tone={m.tone}>{m.posture}</Badge></header>
              <div className="impact-row"><b>{m.agents}</b><span>agents</span></div>
              <div className="impact-row"><b>{m.tasks}</b><span>tasks</span></div>
              <div className="bar"><i style={{ width: `${(t / max) * 100}%` }} /></div>
              <div className="impact-kpi">{m.kpi}</div>
              <div className="impact-row"><b>{m.compliance}%</b><span>policy compliance</span></div>
            </div>
          );
        })}
      </div>
      <p className="footnote">Illustrative demo metrics. Financial and operational figures are synthetic.</p>
    </>
  );
}
