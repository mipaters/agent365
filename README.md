# Agentic Governance Command Center

Front-end demo (Vite + React + TypeScript) for the **Telco Rooms of the House** experience: Microsoft Agent 365 as the control plane for a telco's digital workforce. All data is synthetic and local; no backend or auth.

```
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build
```

- `src/data/` – synthetic dataset shared by every screen (`agents.ts`, `governance.ts`)
- `src/store.tsx` – shared state (navigation persisted per browser session, remediation, audit log)
- `src/components/` – one component per screen plus the detail panel, onboarding wizard, action modal and executive walkthrough

Start with **Start Executive Walkthrough** for the guided 5-step story. Financial and operational figures are illustrative demo metrics.
