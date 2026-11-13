import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Perm, Risk, Room, Status } from "../types";
import { ROOMS, ROOM_COLORS } from "../data/agents";
import { useStore } from "../store";

export function useCountUp(target: number, decimals = 0, ms = 900) {
  const [v, setV] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = from.current;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      const e = 1 - Math.pow(1 - p, 3);
      setV(start + (target - start) * e);
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function Kpi({ value, decimals = 0, prefix = "", suffix = "", label, tone = "blue", tip, onClick }: {
  value: number; decimals?: number; prefix?: string; suffix?: string; label: string;
  tone?: "blue" | "good" | "warn" | "bad"; tip?: string; onClick?: () => void;
}) {
  const shown = useCountUp(value, decimals);
  return (
    <button className={`kpi tone-${tone}`} data-tip={tip} onClick={onClick} disabled={!onClick}>
      <span className="kpi-value">{prefix}{shown}{suffix}</span>
      <span className="kpi-label">{label}</span>
    </button>
  );
}

export const riskTone = (r: Risk) => (r === "Low" ? "good" : r === "Medium" ? "warn" : "bad");
export const statusTone = (s: Status) =>
  s === "Active" ? "good" : s === "Review" || s === "Pending Approval" ? "warn" : s === "Blocked" || s === "Suspended" ? "bad" : "mute";

export const Badge = ({ tone, children }: { tone: "good" | "warn" | "bad" | "mute" | "blue"; children: ReactNode }) => (
  <span className={`badge b-${tone}`}>{children}</span>
);

export const PermBadge = ({ p }: { p: Perm }) => <span className={`perm perm-${p.toLowerCase()}`}>{p}</span>;

export function PageHeader({ title, subtitle, eyebrow, children }: { title: string; subtitle?: string; eyebrow?: string; children?: ReactNode }) {
  return (
    <header className="page-header">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {subtitle && <p className="subtitle">{subtitle}</p>}
      </div>
      {children && <div className="header-actions">{children}</div>}
    </header>
  );
}

export function RoomTabs() {
  const { view, navigate } = useStore();
  return (
    <nav className="room-tabs" aria-label="Rooms">
      {ROOMS.map((r) => (
        <button key={r} className={view === `room:${r}` ? "active" : ""} onClick={() => navigate(`room:${r}` as never)} style={{ ["--c" as string]: ROOM_COLORS[r] }}>
          <i /> {r} Room
        </button>
      ))}
      <span className="room-tabs-gov">Governed by Agent 365</span>
    </nav>
  );
}

export function Modal({ children, onClose, wide }: { children: ReactNode; onClose?: () => void; wide?: boolean }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className={`modal ${wide ? "wide" : ""}`} role="dialog" aria-modal="true">{children}</div>
    </div>
  );
}

export const roomColor = (r: Room) => ROOM_COLORS[r];
