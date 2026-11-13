import { useStore } from "../store";
import { ROOMS, ROOM_COLORS } from "../data/agents";
import type { View } from "../types";

const GOV: { id: View; label: string }[] = [
  { id: "command", label: "Command Center" },
  { id: "registry", label: "Agent Registry" },
  { id: "map", label: "Agent Map" },
  { id: "risk", label: "Risk & Security" },
  { id: "lifecycle", label: "Lifecycle" },
  { id: "audit", label: "Audit" },
  { id: "impact", label: "Business Impact" },
];

export function Sidebar() {
  const { view, navigate, attention } = useStore();
  return (
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark" />Telco Rooms of the House</div>
      <button className={`nav-item ${view === "home" ? "active" : ""}`} onClick={() => navigate("home")}>
        <span className="nav-ico">⌂</span><span className="nav-text">Home</span>
      </button>
      <div className="nav-group">Rooms</div>
      {ROOMS.map((r) => (
        <button key={r} className={`nav-item ${view === `room:${r}` ? "active" : ""}`} onClick={() => navigate(`room:${r}` as View)} title={`${r} Room`}>
          <span className="nav-dot" style={{ background: ROOM_COLORS[r] }} /><span className="nav-text">{r}</span>
        </button>
      ))}
      <hr />
      <div className="nav-group gov">Agentic Governance</div>
      {GOV.map((g, i) => (
        <button key={g.id} className={`nav-item gov ${view === g.id ? "active" : ""}`} onClick={() => navigate(g.id)} title={g.label}>
          <span className="nav-ico">{["◈", "☰", "✳", "⚠", "⟳", "≡", "▲"][i]}</span>
          <span className="nav-text">{g.label}</span>
          {g.id === "risk" && <span className="nav-pill">{attention}</span>}
        </button>
      ))}
      <div className="powered"><span className="ms-logo"><i /><i /><i /><i /></span><span className="nav-text">Powered by <b>Microsoft Agent 365</b></span></div>
    </aside>
  );
}
