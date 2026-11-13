export type Room = "Customer" | "Network" | "Sales" | "Finance" | "Media" | "IT";
export type Risk = "Low" | "Medium" | "High" | "Critical";
export type Perm = "READ" | "WRITE" | "EXECUTE" | "ADMIN";
export type Identity = "Managed" | "Federated" | "External" | "Unmanaged";
export type Status =
  | "Active"
  | "Review"
  | "Inactive"
  | "Pending Approval"
  | "Suspended"
  | "Blocked"
  | "Retired";

export type PolicyKey =
  | "Identity verified"
  | "Owner assigned"
  | "Least privilege policy"
  | "Approved data sources"
  | "Logging enabled"
  | "Human escalation configured"
  | "Lifecycle policy";

export interface Agent {
  id: string;
  name: string;
  room: Room;
  platform: string;
  owner: string;
  techOwner: string;
  identity: Identity;
  agentIdentity: string;
  data: string;
  risk: Risk;
  riskScore: number;
  status: Status;
  lastActivity: string;
  created: string;
  permissions: { system: string; perms: Perm[] }[];
  connectedAgents: string[];
  tools: { name: string; kind: "API" | "MCP" | "System" }[];
  policies: Record<PolicyKey, boolean>;
}

export type View =
  | "home"
  | "room:Customer"
  | "room:Network"
  | "room:Sales"
  | "room:Finance"
  | "room:Media"
  | "room:IT"
  | "command"
  | "registry"
  | "map"
  | "risk"
  | "lifecycle"
  | "audit"
  | "impact";

export type ActionKind =
  | "restrict"
  | "block"
  | "suspend"
  | "assign"
  | "retire"
  | "deactivate";

export interface RiskItem {
  id: string;
  agentId: string;
  severity: "Critical" | "High" | "Medium";
  issue: string;
  facts: { label: string; value: string; tone?: "bad" | "good" | "warn" }[];
  recommendation: string;
  actions: { label: string; kind: ActionKind | "review" | "investigate" | "audit" }[];
}

export interface AuditEvent {
  id: string;
  time: string;
  agentId: string;
  action: string;
  resource: string;
  policy: string;
  decision: "Allowed" | "Blocked" | "Logged";
  user: string;
  severity: "None" | "Medium" | "High" | "Critical";
}
