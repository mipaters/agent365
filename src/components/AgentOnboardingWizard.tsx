import { useEffect, useState } from "react";
import { useStore } from "../store";
import { Modal } from "./ui";

const STEPS = ["Agent Details", "Requested Access", "Risk Assessment", "Governance Policy", "Activate"];

export function AgentOnboardingWizard() {
  const { wizardOpen, setWizardOpen, registerVendorAgent, navigate } = useStore();
  const [step, setStep] = useState(0);
  const [revealed, setRevealed] = useState(0);

  useEffect(() => { if (wizardOpen) { setStep(0); setRevealed(0); } }, [wizardOpen]);
  useEffect(() => {
    if (step !== 2 && step !== 4) return;
    setRevealed(0);
    const total = step === 2 ? 5 : 5;
    const ids: number[] = [];
    for (let i = 1; i <= total; i++) ids.push(window.setTimeout(() => setRevealed(i), i * 450));
    if (step === 4) ids.push(window.setTimeout(registerVendorAgent, 5 * 450));
    return () => ids.forEach(clearTimeout);
  }, [step, registerVendorAgent]);

  if (!wizardOpen) return null;
  const close = () => setWizardOpen(false);
  const ready = step === 4 && revealed >= 5;

  const risk = [
    ["Identity validation", "Verified: Entra Agent ID issued", "good"],
    ["Data classification", "Internal / Confidential (network operations)", "warn"],
    ["Tool permissions", "Read-only telemetry, scoped ServiceNow write", "good"],
    ["External connectivity", "Vendor endpoint allow-listed, TLS pinned", "warn"],
    ["Agent-to-agent access", "Limited to Network Operations Agent", "good"],
  ];
  const done = ["Agent registered", "Agent identity created", "Governance policy applied", "Logging enabled", "Owner assigned"];

  return (
    <Modal wide onClose={close}>
      <div className="wiz-head">
        <h2>Register New Agent</h2>
        <button className="icon-btn" onClick={close} aria-label="Close">✕</button>
      </div>
      <ol className="wiz-steps">
        {STEPS.map((s, i) => <li key={s} className={i === step ? "cur" : i < step ? "done" : ""}><span>{i < step ? "✓" : i + 1}</span>{s}</li>)}
      </ol>
      <div className="wiz-body">
        {step === 0 && (
          <div className="form-grid">
            <label>Name<input readOnly value="Vendor Network Optimization Agent" /></label>
            <label>Platform<input readOnly value="Third-party" /></label>
            <label>Business Domain<input readOnly value="Network" /></label>
            <label>Owner<input readOnly value="Network Engineering" /></label>
          </div>
        )}
        {step === 1 && (
          <>
            <p className="muted">The agent is requesting access to:</p>
            <ul className="req-list">
              {[["OSS telemetry", "READ"], ["Network performance data", "READ"], ["ServiceNow incidents", "READ / WRITE"]].map(([n, p]) => <li key={n}><span>{n}</span><span className="perm perm-read">{p}</span></li>)}
            </ul>
          </>
        )}
        {step === 2 && (
          <ul className="assess">
            {risk.map(([t, d, tone], i) => (
              <li key={t} className={i < revealed ? "shown" : ""}><i className={`dot d-${tone}`} /><b>{t}</b><span>{i < revealed ? d : "Assessing…"}</span></li>
            ))}
          </ul>
        )}
        {step === 3 && (
          <>
            <h3>Standard Network Agent Policy</h3>
            <ul className="policy-list">
              {["Least privilege access", "Production data restrictions", "Audit logging", "Human escalation", "90-day access review"].map((p) => <li key={p} className="ok"><i>✓</i>{p}</li>)}
            </ul>
          </>
        )}
        {step === 4 && (
          <>
            <ul className="assess">
              {done.map((t, i) => <li key={t} className={i < revealed ? "shown" : ""}><i className={`dot ${i < revealed ? "d-good" : "d-mute"}`} /><b>{i < revealed ? "✓ " : ""}{t}</b></li>)}
            </ul>
            {ready && <div className="approved">Approved for Production</div>}
          </>
        )}
      </div>
      <div className="modal-actions">
        {step > 0 && step < 4 && <button className="btn ghost" onClick={() => setStep(step - 1)}>Back</button>}
        {step < 3 && <button className="btn primary" onClick={() => setStep(step + 1)}>Next</button>}
        {step === 3 && <button className="btn primary" onClick={() => setStep(4)}>Apply Policy &amp; Activate</button>}
        {step === 4 && <button className="btn ghost" disabled={!ready} onClick={() => { close(); navigate("registry"); }}>View in Registry</button>}
        {step === 4 && <button className="btn primary" disabled={!ready} onClick={close}>Done</button>}
      </div>
    </Modal>
  );
}
