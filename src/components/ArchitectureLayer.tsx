import { ROOMS, ROOM_COLORS } from "../data/agents";

export function ArchitectureLayer() {
  return (
    <section className="arch" aria-label="Governance architecture">
      <div className="arch-layer rooms">
        <span className="arch-tag">Business Rooms</span>
        <div className="arch-chips">
          {ROOMS.map((r) => (
            <span key={r} style={{ borderColor: ROOM_COLORS[r] }}>{r}</span>
          ))}
        </div>
      </div>
      <div className="arch-arrow">↓</div>
      <div className="arch-layer">
        <span className="arch-tag">Digital Workforce</span>
        <div className="arch-chips">
          {["Agents", "Copilots", "Autonomous Agents", "Third-Party Agents"].map((c) => <span key={c}>{c}</span>)}
        </div>
      </div>
      <div className="arch-arrow">↓</div>
      <div className="arch-layer control">
        <span className="arch-tag">Control Plane</span>
        <strong>Microsoft Agent 365</strong>
      </div>
      <div className="arch-arrow">↓</div>
      <div className="arch-layer">
        <span className="arch-tag">Enterprise Foundation</span>
        <div className="arch-chips">
          {["Identity", "Security", "Compliance", "Data", "Audit"].map((c) => <span key={c}>{c}</span>)}
        </div>
      </div>
      <p className="arch-msg">Every room can create agents. <b>Agent 365 governs the house.</b></p>
    </section>
  );
}
