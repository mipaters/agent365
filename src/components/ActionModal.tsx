import { useEffect, useState } from "react";
import { useStore, RESTRICT_TARGET } from "../store";
import { Modal } from "./ui";
import type { ActionKind } from "../types";

const COPY: Record<Exclude<ActionKind, "restrict">, { title: (n: string) => string; body: string; button: string; done: string }> = {
  block: { title: (n) => `Block ${n}?`, body: "The agent's identity will be disabled and all tool and data access revoked.", button: "Block Agent", done: "Agent blocked" },
  suspend: { title: (n) => `Suspend ${n}?`, body: "The agent stops executing immediately. Access is preserved so it can be reinstated after review.", button: "Suspend Agent", done: "Agent suspended" },
  assign: { title: (n) => `Assign an owner to ${n}?`, body: "Marketing Operations becomes the accountable business owner and the agent re-enters the policy review cycle.", button: "Assign Owner", done: "Owner assigned" },
  retire: { title: (n) => `Retire ${n}?`, body: "The agent identity is decommissioned, credentials are revoked and its record is archived.", button: "Retire Agent", done: "Agent retired" },
  deactivate: { title: (n) => `Deactivate ${n}?`, body: "The agent is switched off but remains in the registry for review.", button: "Deactivate", done: "Agent deactivated" },
};

export function ActionModal() {
  const { pending, requestAction, agentById, commit, compliance, navigate, setAuditAgentFilter, walkthroughStep } = useStore();
  const [phase, setPhase] = useState<"confirm" | "applying" | "done">("confirm");
  const [snap, setSnap] = useState<{ risk: string; compliance: number } | null>(null);

  useEffect(() => { setPhase("confirm"); setSnap(null); }, [pending?.agentId, pending?.kind]);
  if (!pending) return null;
  const agent = agentById(pending.agentId);
  if (!agent) return null;

  const isRestrict = pending.kind === "restrict";
  const target = RESTRICT_TARGET[agent.id] ?? { system: agent.permissions[0].system, perm: "ADMIN" as const };
  const remaining = agent.permissions.find((p) => p.system === target.system)?.perms.filter((p) => p !== target.perm).join(" and ") ?? "";
  const copy = isRestrict ? null : COPY[pending.kind as Exclude<ActionKind, "restrict">];
  const close = () => requestAction(null);

  const apply = () => {
    setSnap({ risk: agent.risk.toUpperCase(), compliance });
    setPhase("applying");
    window.setTimeout(() => { commit(pending); setPhase("done"); }, 1500);
  };
  const dev = agent.id === "developer-agent";

  return (
    <Modal onClose={phase === "applying" ? undefined : close}>
      {phase === "confirm" && (
        <>
          <h2>{isRestrict ? `Remove ${target.perm} permission from ${agent.name}?` : copy!.title(agent.name)}</h2>
          <p className="modal-text">
            {isRestrict
              ? <>The agent will retain <b>{remaining}</b> permissions on {target.system}. The change takes effect immediately and is recorded in the audit trail.</>
              : copy!.body}
          </p>
          <div className="modal-actions">
            <button className="btn ghost" onClick={close}>Cancel</button>
            <button className={`btn ${isRestrict || pending.kind === "assign" ? "primary" : "danger"}`} onClick={apply}>{isRestrict ? "Apply Policy" : copy!.button}</button>
          </div>
        </>
      )}
      {phase === "applying" && (
        <div className="applying">
          <div className="spinner" />
          <h2>Applying Governance Policy...</h2>
          <div className="progress"><i /></div>
        </div>
      )}
      {phase === "done" && (
        <div className="done">
          <div className="check">✓</div>
          <h2>{isRestrict ? "Permissions Updated" : copy!.done}</h2>
          {isRestrict && (
            <div className="delta-row">
              <div><span className="muted">Risk</span><b><s>{snap?.risk}</s> → <em>LOW</em></b></div>
              <div><span className="muted">Policy Compliance</span><b>{dev ? <><s>93%</s> → <em>100%</em></> : <><s>{snap?.compliance}%</s> → <em>{compliance}%</em></>}</b></div>
            </div>
          )}
          {!isRestrict && <p className="modal-text">{agent.name} is now <b>{agent.status}</b>.</p>}
          <p className="logged">Governance action logged in the audit trail.</p>
          <div className="modal-actions">
            {walkthroughStep === null && <button className="btn ghost" onClick={() => { close(); setAuditAgentFilter(agent.id); navigate("audit"); }}>View Audit Trail</button>}
            <button className="btn primary" onClick={close}>Done</button>
          </div>
        </div>
      )}
    </Modal>
  );
}
