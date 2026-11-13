import type { AuditEvent, RiskItem, Room } from "../types";
import { slug } from "./agents";

export const BASE = {
  agents: 487,
  attention: 14,
  compliance: 97,
  impactM: 38.4,
  severity: { Critical: 2, High: 5, Medium: 7 },
  lifecycle: { ownerless: 17, inactive: 8, awaiting: 4, expiring: 3, retire: 2 },
};

export const RISK_ITEMS: RiskItem[] = [
  {
    id: "risk-shadow",
    agentId: slug("Shadow Procurement Agent"),
    severity: "Critical",
    issue: "Unregistered agent holds ADMIN rights on the ERP payments module",
    facts: [
      { label: "Discovered", value: "Shadow agent via API traffic analysis", tone: "bad" },
      { label: "Current access", value: "READ / WRITE / EXECUTE / ADMIN", tone: "bad" },
      { label: "Owner", value: "None", tone: "bad" },
    ],
    recommendation: "Suspend immediately, then onboard through the registration workflow.",
    actions: [
      { label: "View Audit Trail", kind: "audit" },
      { label: "Suspend Agent", kind: "suspend" },
    ],
  },
  {
    id: "risk-dev",
    agentId: slug("Developer Agent"),
    severity: "High",
    issue: "Repository access exceeds required privileges",
    facts: [
      { label: "Current access", value: "READ / WRITE / ADMIN", tone: "bad" },
      { label: "Recommended", value: "READ / WRITE", tone: "good" },
      { label: "Identity", value: "External (Anthropic)", tone: "warn" },
    ],
    recommendation: "Remove ADMIN on GitHub. The agent keeps READ and WRITE.",
    actions: [
      { label: "Review Permissions", kind: "review" },
      { label: "Restrict Access", kind: "restrict" },
      { label: "Block Agent", kind: "block" },
    ],
  },
  {
    id: "risk-research",
    agentId: slug("Customer Data Research Agent"),
    severity: "High",
    issue: "Agent attempted access to restricted customer dataset",
    facts: [
      { label: "Policy triggered", value: "Restricted Customer Data (PII)", tone: "warn" },
      { label: "Result", value: "Access denied", tone: "good" },
      { label: "Incident", value: "Logged. Human review required", tone: "warn" },
    ],
    recommendation: "Investigate the intent of the request and review the agent's approved data sources.",
    actions: [
      { label: "Investigate", kind: "investigate" },
      { label: "View Audit Trail", kind: "audit" },
      { label: "Suspend Agent", kind: "suspend" },
    ],
  },
  {
    id: "risk-legacy",
    agentId: slug("Legacy Marketing Agent"),
    severity: "Medium",
    issue: "Agent has no active owner",
    facts: [
      { label: "Owner", value: "Unassigned", tone: "bad" },
      { label: "Last activity", value: "61 days ago", tone: "warn" },
      { label: "Access", value: "CRM write, marketing automation", tone: "warn" },
    ],
    recommendation: "Assign an owner or begin the retirement workflow.",
    actions: [
      { label: "Assign Owner", kind: "assign" },
      { label: "Retire Agent", kind: "retire" },
    ],
  },
  {
    id: "risk-marketing",
    agentId: slug("Marketing Campaign Agent"),
    severity: "Medium",
    issue: "External agent reads audience data outside approved sources",
    facts: [
      { label: "Identity", value: "External (Salesforce)", tone: "warn" },
      { label: "Data", value: "Audience segments not on allow-list", tone: "warn" },
    ],
    recommendation: "Restrict to approved audience datasets.",
    actions: [
      { label: "Review Permissions", kind: "review" },
      { label: "Restrict Access", kind: "restrict" },
    ],
  },
  {
    id: "risk-servicedesk",
    agentId: slug("Service Desk Agent"),
    severity: "Medium",
    issue: "Broad EXECUTE rights on ServiceNow exceed least privilege",
    facts: [
      { label: "Current access", value: "READ / WRITE / EXECUTE", tone: "warn" },
      { label: "Recommended", value: "READ / WRITE", tone: "good" },
    ],
    recommendation: "Scope execution to approved catalogue items.",
    actions: [
      { label: "Review Permissions", kind: "review" },
      { label: "Restrict Access", kind: "restrict" },
    ],
  },
];

export const AUDIT_EVENTS: AuditEvent[] = [
  { id: "a1", time: "09:41", agentId: slug("Network Operations Agent"), action: "Queried network telemetry", resource: "OSS Telemetry", policy: "Network Production Data Policy", decision: "Allowed", user: "Service identity", severity: "None" },
  { id: "a2", time: "09:38", agentId: slug("Retention Agent"), action: "Requested customer billing history", resource: "Billing Platform", policy: "Customer Data Access Policy", decision: "Allowed", user: "Service identity", severity: "None" },
  { id: "a3", time: "09:36", agentId: slug("Customer Data Research Agent"), action: "Security incident created", resource: "SecOps incident queue", policy: "Restricted Customer Data Policy", decision: "Logged", user: "Governance engine", severity: "High" },
  { id: "a4", time: "09:35", agentId: slug("Customer Data Research Agent"), action: "Access denied by governance policy", resource: "Restricted customer dataset", policy: "Restricted Customer Data Policy", decision: "Blocked", user: "Governance engine", severity: "High" },
  { id: "a5", time: "09:35", agentId: slug("Customer Data Research Agent"), action: "Attempted restricted dataset access", resource: "Restricted customer dataset", policy: "Restricted Customer Data Policy", decision: "Blocked", user: "Service identity", severity: "High" },
  { id: "a6", time: "09:31", agentId: slug("Service Desk Agent"), action: "Reset employee credentials via workflow", resource: "ServiceNow", policy: "ITSM Standard Policy", decision: "Allowed", user: "R. Lavigne (requester)", severity: "None" },
  { id: "a7", time: "09:28", agentId: slug("Shadow Procurement Agent"), action: "Posted payment batch to ERP", resource: "ERP payments", policy: "Unregistered Agent Policy", decision: "Blocked", user: "Unknown", severity: "Critical" },
  { id: "a8", time: "09:24", agentId: slug("Anomaly Detection Agent"), action: "Raised cell-site anomaly alert", resource: "OSS Telemetry", policy: "Network Production Data Policy", decision: "Allowed", user: "Service identity", severity: "None" },
  { id: "a9", time: "09:22", agentId: slug("Developer Agent"), action: "Permissions changed by administrator", resource: "GitHub", policy: "Least Privilege Policy", decision: "Logged", user: "Admin: S. Marchand", severity: "Medium" },
  { id: "a10", time: "09:18", agentId: slug("Marketing Campaign Agent"), action: "Read audience segment export", resource: "Audience Analytics", policy: "Approved Data Sources Policy", decision: "Allowed", user: "Service identity", severity: "Medium" },
  { id: "a11", time: "09:15", agentId: slug("Journal Agent"), action: "Drafted month-end journal entries", resource: "ERP", policy: "Finance Controls Policy", decision: "Allowed", user: "E. Chen (approver)", severity: "None" },
  { id: "a12", time: "09:10", agentId: slug("SMB Sales Agent"), action: "Invoked CRM API", resource: "Customer CRM", policy: "Customer Data Access Policy", decision: "Allowed", user: "Service identity", severity: "None" },
  { id: "a13", time: "09:06", agentId: slug("Developer Agent"), action: "Attempted to delete protected branch", resource: "GitHub", policy: "Least Privilege Policy", decision: "Blocked", user: "Service identity", severity: "High" },
  { id: "a14", time: "09:02", agentId: slug("Field Operations Agent"), action: "Dispatched technician to site", resource: "ServiceNow", policy: "Field Operations Policy", decision: "Allowed", user: "Service identity", severity: "None" },
  { id: "a15", time: "08:57", agentId: slug("Sports Engagement Agent"), action: "Published match-day content", resource: "Content Library", policy: "Media Publishing Policy", decision: "Allowed", user: "Service identity", severity: "None" },
  { id: "a16", time: "08:49", agentId: slug("Billing Assistant"), action: "Applied bill credit under threshold", resource: "Billing Platform", policy: "Billing Adjustment Policy", decision: "Allowed", user: "Service identity", severity: "None" },
  { id: "a17", time: "08:44", agentId: slug("Change Management Agent"), action: "Escalated high-risk change for human approval", resource: "ServiceNow", policy: "Human Escalation Policy", decision: "Logged", user: "Service identity", severity: "None" },
];

export const IMPACT_BY_ROOM: Record<Room, { agents: number; tasks: string; kpi: string; compliance: number; tone: "good" | "warn" | "bad"; posture: string }> = {
  Customer: { agents: 124, tasks: "143K", kpi: "$14.2M annualized impact", compliance: 98, tone: "good", posture: "Healthy" },
  Network: { agents: 86, tasks: "47K", kpi: "18% faster incident triage", compliance: 96, tone: "good", posture: "Healthy" },
  Sales: { agents: 78, tasks: "38K", kpi: "$9.6M pipeline influenced", compliance: 97, tone: "warn", posture: "Monitor" },
  Finance: { agents: 52, tasks: "21K", kpi: "$4.8M leakage recovered", compliance: 95, tone: "bad", posture: "Attention" },
  Media: { agents: 61, tasks: "19K", kpi: "22% higher fan engagement", compliance: 97, tone: "good", posture: "Healthy" },
  IT: { agents: 86, tasks: "20K", kpi: "31% fewer L1 tickets", compliance: 95, tone: "warn", posture: "Monitor" },
};

export const LIFECYCLE_STAGES = ["Discover", "Register", "Validate", "Approve", "Activate", "Monitor", "Review", "Retire"];

export const WALKTHROUGH = [
  { title: "The Digital Workforce Has Arrived", highlight: "487 agents across six platforms and eight business domains.", narrative: "Agents are rapidly becoming part of the workforce, but most enterprises lack a single view of where those agents are operating.", view: "command" as const },
  { title: "See Every Agent", highlight: "Microsoft and third-party agents in one registry.", narrative: "Agent 365 creates a unified registry across the enterprise agent estate.", view: "registry" as const },
  { title: "Understand What Agents Can Do", highlight: "Developer Agent: GitHub, DevOps, ServiceNow, internal documentation.", narrative: "Governance isn't simply knowing that an agent exists. It means understanding its identity, connections and permissions.", view: "map" as const },
  { title: "Turn Risk into Action", highlight: "Developer Agent risk: HIGH → LOW with one governance action.", narrative: "When an agent violates policy or accumulates excessive privileges, governance becomes operational.", view: "risk" as const },
  { title: "Manage Agents Like Employees", highlight: "Impact, risk posture and compliance by room.", narrative: "The end state is a new operating model where organizations manage digital workers alongside human workers, with identity, access, security, lifecycle controls and measurable business outcomes.", view: "impact" as const },
];
