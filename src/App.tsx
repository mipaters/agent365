import { StoreProvider, useStore } from "./store";
import { Sidebar } from "./components/Sidebar";
import { AgentGovernanceHome, HomeView, RoomView } from "./components/AgentGovernanceHome";
import { AgentRegistry } from "./components/AgentRegistry";
import { AgentDetailPanel } from "./components/AgentDetailPanel";
import { AgentMap } from "./components/AgentMap";
import { RiskCommandCenter } from "./components/RiskCommandCenter";
import { LifecycleManagement } from "./components/LifecycleManagement";
import { AgentOnboardingWizard } from "./components/AgentOnboardingWizard";
import { AuditTrail } from "./components/AuditTrail";
import { BusinessImpact } from "./components/BusinessImpact";
import { ExecutiveWalkthrough } from "./components/ExecutiveWalkthrough";
import { ActionModal } from "./components/ActionModal";
import type { Room } from "./types";

function Screen() {
  const { view } = useStore();
  if (view.startsWith("room:")) return <RoomView room={view.slice(5) as Room} />;
  switch (view) {
    case "home": return <HomeView />;
    case "registry": return <AgentRegistry />;
    case "map": return <AgentMap />;
    case "risk": return <RiskCommandCenter />;
    case "lifecycle": return <LifecycleManagement />;
    case "audit": return <AuditTrail />;
    case "impact": return <BusinessImpact />;
    default: return <AgentGovernanceHome />;
  }
}

export default function App() {
  return (
    <StoreProvider>
      <div className="app">
        <Sidebar />
        <main className="main" key="main"><Screen /></main>
        <AgentDetailPanel />
        <AgentOnboardingWizard />
        <ActionModal />
        <ExecutiveWalkthrough />
      </div>
    </StoreProvider>
  );
}
