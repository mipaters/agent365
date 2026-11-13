import { useMemo } from "react";
import { useStore } from "../store";
import { ROOMS, ROOM_COLORS } from "../data/agents";
import { PageHeader, RoomTabs, PermBadge } from "./ui";
import { HeaderButtons } from "./AgentGovernanceHome";
import type { Room } from "../types";

const W = 1200, H = 800, CX = 600, CY = 400;
const pt = (angle: number, rx: number, ry: number) => ({ x: CX + rx * Math.cos(angle), y: CY + ry * Math.sin(angle) });
const short = (n: string) => n.replace(/ Agent$/, "").replace(/ Assistant$/, " Asst.");

interface N { id: string; label: string; kind: "center" | "room" | "agent" | "system"; x: number; y: number; room?: Room }

export function AgentMap() {
  const { agents, mapSelected, setMapSelected, selectAgent, agentById } = useStore();

  const { nodes, edges } = useMemo(() => {
    const live = agents.filter((a) => a.status !== "Retired");
    const ordered = ROOMS.flatMap((r) => live.filter((a) => a.room === r));
    const nodes: N[] = [{ id: "center", label: "Enterprise Agent Estate", kind: "center", x: CX, y: CY }];
    const angleOf: Record<string, number> = {};
    ordered.forEach((a, i) => {
      const ang = -Math.PI / 2 + (i / ordered.length) * Math.PI * 2;
      angleOf[a.id] = ang;
      const p = pt(ang, i % 2 ? 350 : 270, i % 2 ? 250 : 190);
      nodes.push({ id: a.id, label: short(a.name), kind: "agent", room: a.room, ...p });
    });
    ROOMS.forEach((r) => {
      const angs = ordered.filter((a) => a.room === r).map((a) => angleOf[a.id]);
      if (!angs.length) return;
      const mid = angs.reduce((s, v) => s + v, 0) / angs.length;
      nodes.push({ id: `room:${r}`, label: r, kind: "room", room: r, ...pt(mid, 150, 108) });
    });
    const sysAngles: Record<string, number[]> = {};
    live.forEach((a) => a.permissions.forEach((p) => (sysAngles[p.system] ??= []).push(angleOf[a.id])));
    const systems = Object.entries(sysAngles)
      .map(([name, angs]) => ({ name, mean: Math.atan2(angs.reduce((s, v) => s + Math.sin(v), 0), angs.reduce((s, v) => s + Math.cos(v), 0)) }))
      .sort((a, b) => a.mean - b.mean);
    systems.forEach((s, i) => {
      const ang = -Math.PI / 2 + (i / systems.length) * Math.PI * 2;
      nodes.push({ id: `sys:${s.name}`, label: s.name, kind: "system", ...pt(ang, 500, 345) });
    });
    const edges: { a: string; b: string; type: "room" | "agent" | "system" }[] = [];
    ROOMS.forEach((r) => edges.push({ a: "center", b: `room:${r}`, type: "room" }));
    const seen = new Set<string>();
    live.forEach((a) => {
      edges.push({ a: `room:${a.room}`, b: a.id, type: "room" });
      a.permissions.forEach((p) => edges.push({ a: a.id, b: `sys:${p.system}`, type: "system" }));
      a.connectedAgents.forEach((c) => {
        const key = [a.id, c].sort().join("|");
        if (!seen.has(key) && live.some((x) => x.id === c)) { seen.add(key); edges.push({ a: a.id, b: c, type: "agent" }); }
      });
    });
    return { nodes, edges };
  }, [agents]);

  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const neighbours = new Set<string>();
  if (mapSelected) {
    neighbours.add(mapSelected);
    edges.forEach((e) => { if (e.a === mapSelected) neighbours.add(e.b); if (e.b === mapSelected) neighbours.add(e.a); });
  }
  const dim = (id: string) => (mapSelected && !neighbours.has(id) ? "dim" : "");
  const sel = mapSelected ? agentById(mapSelected) : undefined;
  const selNode = mapSelected ? byId[mapSelected] : undefined;
  const linked = (kind: N["kind"]) => nodes.filter((n) => n.kind === kind && n.id !== mapSelected && neighbours.has(n.id));

  return (
    <>
      <RoomTabs />
      <PageHeader title="Understand the agent ecosystem" subtitle="Agents are no longer isolated applications. They form an interconnected enterprise ecosystem."><HeaderButtons /></PageHeader>
      <div className="map-banner"><b>487</b> agents <i>|</i> <b>1,842</b> connections <i>|</i> <b>73</b> enterprise systems <span className="muted"> · synthetic demo values</span></div>
      <div className="map-layout">
        <div className="map-canvas">
          <svg viewBox={`-90 0 ${W + 180} ${H}`} role="img" aria-label="Agent ecosystem map" onClick={() => setMapSelected(null)}>
            {edges.map((e, i) => {
              const a = byId[e.a], b = byId[e.b];
              if (!a || !b) return null;
              const on = mapSelected && (e.a === mapSelected || e.b === mapSelected);
              return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={`edge e-${e.type} ${on ? "on" : mapSelected ? "dim" : ""}`} />;
            })}
            {nodes.map((n) => {
              const c = n.room ? ROOM_COLORS[n.room] : "#4aa3ff";
              const r = n.kind === "center" ? 52 : n.kind === "room" ? 30 : n.kind === "system" ? 8 : 9;
              const left = n.x < CX;
              return (
                <g key={n.id} className={`node n-${n.kind} ${dim(n.id)} ${mapSelected === n.id ? "sel" : ""}`} onClick={(e) => { e.stopPropagation(); setMapSelected(n.id === mapSelected ? null : n.id); }} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setMapSelected(n.id)}>
                  {n.kind === "system" ? <rect x={n.x - r} y={n.y - r} width={r * 2} height={r * 2} rx={2} fill="#0b1b33" stroke="#7dd3fc" /> : <circle cx={n.x} cy={n.y} r={r} fill={n.kind === "center" ? "#0b3a8a" : n.kind === "room" ? c : "#0b1b33"} stroke={c} strokeWidth={n.kind === "agent" ? 2 : 1.5} fillOpacity={n.kind === "room" ? 0.25 : 1} />}
                  {n.kind === "center" || n.kind === "room" ? (
                    <text x={n.x} y={n.y + 4} textAnchor="middle" className={n.kind === "center" ? "lbl-center" : "lbl-room"}>
                      {n.kind === "center" ? (<><tspan x={n.x} dy="-4">Enterprise</tspan><tspan x={n.x} dy="14">Agent Estate</tspan></>) : n.label}
                    </text>
                  ) : (
                    <text x={n.x + (left ? -r - 6 : r + 6)} y={n.y + 3} textAnchor={left ? "end" : "start"} className={n.kind === "system" ? "lbl-sys" : "lbl-agent"}>{n.label}</text>
                  )}
                </g>
              );
            })}
          </svg>
          <div className="map-legend"><span><i className="lg-agent" />Agent</span><span><i className="lg-sys" />Data / application</span><span><i className="lg-line" />Agent-to-agent</span></div>
        </div>
        <aside className="map-info">
          {!selNode && <div className="empty">Select any node to highlight its connections.</div>}
          {selNode && (
            <>
              <h3>{selNode.label}</h3>
              <div className="muted">{selNode.kind === "agent" ? `${sel?.room} Room · ${sel?.platform}` : selNode.kind === "system" ? "Enterprise system" : selNode.kind === "room" ? "Business room" : "Governance scope"}</div>
              {sel && (
                <>
                  <h4>Access</h4>
                  <ul className="perm-list">{sel.permissions.map((p) => <li key={p.system}><span>{p.system}</span><span className="perm-badges">{p.perms.map((x) => <PermBadge key={x} p={x} />)}</span></li>)}</ul>
                  <h4>Connected agents</h4>
                  <div className="chip-wrap">{linked("agent").length ? linked("agent").map((n) => <button key={n.id} className="agent-chip" onClick={() => setMapSelected(n.id)}>{n.label}</button>) : <span className="muted">None</span>}</div>
                  <h4>Connected tools</h4>
                  <ul className="tool-list">{sel.tools.map((t) => <li key={t.name}><span className="tool-kind">{t.kind}</span>{t.name}</li>)}</ul>
                  <button className="btn primary sm" onClick={() => selectAgent(sel.id)}>Open agent details</button>
                </>
              )}
              {!sel && (
                <>
                  <h4>Connections ({neighbours.size - 1})</h4>
                  <div className="chip-wrap">
                    {[...linked("agent"), ...linked("system"), ...linked("room")].slice(0, 24).map((n) => <button key={n.id} className="agent-chip" onClick={() => setMapSelected(n.id)}>{n.label}</button>)}
                  </div>
                </>
              )}
            </>
          )}
        </aside>
      </div>
    </>
  );
}

