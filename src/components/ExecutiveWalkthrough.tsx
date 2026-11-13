import { useEffect } from "react";
import { useStore } from "../store";
import { WALKTHROUGH } from "../data/governance";

export function ExecutiveWalkthrough() {
  const { walkthroughStep: step, setWalkthroughStep, navigate, setMapSelected, requestAction, resolved, commit, pending, agentById } = useStore();

  useEffect(() => {
    if (step === null || step >= WALKTHROUGH.length) return;
    navigate(WALKTHROUGH[step].view);
    if (step === 2) setMapSelected("developer-agent");
    if (step === 3 && !resolved["risk-dev"]) requestAction({ kind: "restrict", agentId: "developer-agent", riskId: "risk-dev" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  if (step === null) return null;
  const close = () => { setWalkthroughStep(null); requestAction(null); };

  if (step >= WALKTHROUGH.length) {
    return (
      <div className="finale">
        <div className="finale-inner">
          <div className="finale-logo"><span className="ms-logo big"><i /><i /><i /><i /></span></div>
          <h1>Agent 365</h1>
          <p>The control plane for the agentic enterprise.</p>
          <div className="finale-actions">
            <button className="btn ghost" onClick={() => setWalkthroughStep(0)}>Restart Walkthrough</button>
            <button className="btn primary" onClick={() => { close(); navigate("command"); }}>Explore Command Center</button>
          </div>
        </div>
      </div>
    );
  }

  const s = WALKTHROUGH[step];
  const next = () => {
    if (step === 3 && !resolved["risk-dev"]) {
      const dev = agentById("developer-agent");
      if (dev) commit({ kind: "restrict", agentId: "developer-agent", riskId: "risk-dev" });
    }
    if (step === 3) requestAction(null);
    setWalkthroughStep(step + 1);
  };
  void pending;

  return (
    <div className="walk" role="dialog" aria-label="Executive walkthrough">
      <div className="walk-top">
        <span className="walk-step">Step {step + 1} of {WALKTHROUGH.length}</span>
        <button className="icon-btn" onClick={close} aria-label="Exit walkthrough">✕</button>
      </div>
      <h3>{s.title}</h3>
      <div className="walk-hl">{s.highlight}</div>
      <p>“{s.narrative}”</p>
      <div className="walk-foot">
        <div className="dots">{WALKTHROUGH.map((_, i) => <i key={i} className={i === step ? "on" : i < step ? "past" : ""} />)}</div>
        <div>
          {step > 0 && <button className="btn ghost sm" onClick={() => { requestAction(null); setWalkthroughStep(step - 1); }}>Back</button>}
          <button className="btn primary sm" onClick={next}>{step === WALKTHROUGH.length - 1 ? "Finish" : "Next"}</button>
        </div>
      </div>
    </div>
  );
}
