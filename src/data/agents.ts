import type { Agent, Perm, PolicyKey, Risk, Room, Status, Identity } from "../types";

export const ROOMS: Room[] = ["Customer", "Network", "Sales", "Finance", "Media", "IT"];

export const POLICY_KEYS: PolicyKey[] = [
  "Identity verified",
  "Owner assigned",
  "Least privilege policy",
  "Approved data sources",
  "Logging enabled",
  "Human escalation configured",
  "Lifecycle policy",
];

export const PLATFORMS = [
  "Microsoft Copilot Studio",
  "Microsoft Foundry",
  "ServiceNow",
  "Salesforce",
  "Google",
  "Anthropic",
  "Custom API",
  "Third-party",
];

export const slug = (n: string) => n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

type P = [string, Perm[]];
interface Spec {
  name: string;
  room: Room;
  platform: string;
  owner: string;
  tech: string;
  identity: Identity;
  data: string;
  risk: Risk;
  score: number;
  status: Status;
  last: string;
  created: string;
  perms: P[];
  links: string[];
  tools: [string, "API" | "MCP" | "System"][];
  failing?: PolicyKey[];
}

const R: Perm[] = ["READ"];
const RW: Perm[] = ["READ", "WRITE"];
const RWX: Perm[] = ["READ", "WRITE", "EXECUTE"];

const specs: Spec[] = [
  // CUSTOMER
  { name: "Customer Care Agent", room: "Customer", platform: "Microsoft Copilot Studio", owner: "Customer Care", tech: "A. Tremblay", identity: "Managed", data: "CRM / knowledge base", risk: "Low", score: 14, status: "Active", last: "1 min ago", created: "2025-03-12", perms: [["Customer CRM", RW], ["Knowledge Base", R], ["Billing Platform", R], ["Microsoft Graph", R]], links: ["Retention Agent", "Billing Assistant", "Plan Recommendation Agent"], tools: [["Dynamics 365 API", "API"], ["Knowledge MCP Server", "MCP"]] },
  { name: "Retention Agent", room: "Customer", platform: "Microsoft Copilot Studio", owner: "Consumer", tech: "M. Singh", identity: "Managed", data: "CRM / billing", risk: "Low", score: 18, status: "Active", last: "3 min ago", created: "2025-04-02", perms: [["Customer 360", R], ["Billing Platform", R], ["Customer CRM", RW]], links: ["Next Best Offer Agent", "Customer Care Agent", "Plan Recommendation Agent"], tools: [["Offer Engine API", "API"], ["Customer 360 MCP Server", "MCP"]] },
  { name: "Billing Assistant", room: "Customer", platform: "Microsoft Copilot Studio", owner: "Billing Operations", tech: "L. Okafor", identity: "Managed", data: "Billing / invoices", risk: "Low", score: 21, status: "Active", last: "5 min ago", created: "2025-02-19", perms: [["Billing Platform", RW], ["Customer CRM", R]], links: ["Customer Care Agent", "Revenue Assurance Agent"], tools: [["Billing API", "API"]] },
  { name: "Plan Recommendation Agent", room: "Customer", platform: "Microsoft Foundry", owner: "Consumer", tech: "P. Nguyen", identity: "Managed", data: "Usage / plan catalogue", risk: "Low", score: 12, status: "Active", last: "2 min ago", created: "2025-05-21", perms: [["Customer 360", R], ["Product Catalogue", R]], links: ["Next Best Offer Agent", "Customer Care Agent"], tools: [["Catalogue API", "API"]] },
  { name: "Customer Data Research Agent", room: "Customer", platform: "Google", owner: "Data Science", tech: "R. Haddad", identity: "Federated", data: "Customer datasets", risk: "High", score: 78, status: "Review", last: "9 min ago", created: "2025-08-14", perms: [["Customer 360", R], ["Data Lake", RW]], links: ["Customer Care Agent"], tools: [["Vertex AI Connector", "API"], ["Dataset Explorer MCP", "MCP"]], failing: ["Approved data sources", "Human escalation configured"] },
  { name: "Churn Pilot Agent", room: "Customer", platform: "Microsoft Copilot Studio", owner: "Consumer", tech: "M. Singh", identity: "Managed", data: "CRM / billing", risk: "Low", score: 9, status: "Inactive", last: "94 days ago", created: "2024-11-05", perms: [["Customer CRM", R]], links: ["Retention Agent"], tools: [["Churn Model API", "API"]], failing: ["Lifecycle policy"] },
  // NETWORK
  { name: "Network Operations Agent", room: "Network", platform: "Microsoft Foundry", owner: "Network Operations", tech: "J. Bouchard", identity: "Managed", data: "OSS / telemetry", risk: "Low", score: 16, status: "Active", last: "Just now", created: "2025-01-28", perms: [["OSS Telemetry", RWX], ["ServiceNow", RW], ["Network Inventory", R]], links: ["Anomaly Detection Agent", "Field Operations Agent", "Change Management Agent"], tools: [["Telemetry MCP Server", "MCP"], ["ServiceNow API", "API"]] },
  { name: "Anomaly Detection Agent", room: "Network", platform: "Microsoft Foundry", owner: "Network Operations", tech: "S. Wallace", identity: "Managed", data: "RAN / core telemetry", risk: "Low", score: 11, status: "Active", last: "Just now", created: "2025-03-30", perms: [["OSS Telemetry", R], ["Data Lake", R]], links: ["Network Operations Agent", "Incident Response Agent"], tools: [["Streaming Analytics API", "API"]] },
  { name: "Field Operations Agent", room: "Network", platform: "ServiceNow", owner: "Field Operations", tech: "D. Roy", identity: "Federated", data: "Work orders / inventory", risk: "Medium", score: 41, status: "Active", last: "4 min ago", created: "2025-06-09", perms: [["ServiceNow", RW], ["Network Inventory", R], ["Workforce Scheduling", RW]], links: ["Network Operations Agent", "Change Management Agent"], tools: [["Dispatch API", "API"]] },
  { name: "Change Management Agent", room: "Network", platform: "ServiceNow", owner: "Network Engineering", tech: "K. Patel", identity: "Federated", data: "Change records", risk: "Low", score: 24, status: "Active", last: "12 min ago", created: "2025-02-11", perms: [["ServiceNow", RWX], ["OSS Telemetry", R]], links: ["Network Operations Agent", "Field Operations Agent"], tools: [["Change API", "API"]] },
  { name: "Spectrum Planner Agent", room: "Network", platform: "Custom API", owner: "Network Engineering", tech: "K. Patel", identity: "Managed", data: "Spectrum / RF planning", risk: "Low", score: 10, status: "Inactive", last: "112 days ago", created: "2024-10-17", perms: [["Network Inventory", R]], links: [], tools: [["RF Planner API", "API"]], failing: ["Lifecycle policy"] },
  // SALES
  { name: "SMB Sales Agent", room: "Sales", platform: "Microsoft Copilot Studio", owner: "Business", tech: "T. Lavoie", identity: "Managed", data: "CRM / customer data", risk: "Low", score: 17, status: "Active", last: "6 min ago", created: "2025-04-18", perms: [["Customer CRM", RW], ["Product Catalogue", R], ["SharePoint", R]], links: ["Lead Qualification Agent", "Next Best Offer Agent"], tools: [["CRM API", "API"], ["Quote Builder MCP", "MCP"]] },
  { name: "Lead Qualification Agent", room: "Sales", platform: "Salesforce", owner: "Business", tech: "T. Lavoie", identity: "Federated", data: "Leads / firmographics", risk: "Low", score: 26, status: "Active", last: "8 min ago", created: "2025-05-07", perms: [["Customer CRM", RW]], links: ["SMB Sales Agent"], tools: [["Salesforce Einstein API", "API"]] },
  { name: "Next Best Offer Agent", room: "Sales", platform: "Microsoft Foundry", owner: "Consumer", tech: "P. Nguyen", identity: "Managed", data: "Customer 360 / offers", risk: "Low", score: 19, status: "Active", last: "2 min ago", created: "2025-03-03", perms: [["Customer 360", R], ["Product Catalogue", R]], links: ["Retention Agent", "SMB Sales Agent", "Plan Recommendation Agent"], tools: [["Offer Engine API", "API"]] },
  { name: "Legacy Marketing Agent", room: "Sales", platform: "Custom API", owner: "Unassigned", tech: "Unknown", identity: "Unmanaged", data: "CRM / audience data", risk: "Medium", score: 58, status: "Inactive", last: "61 days ago", created: "2023-09-22", perms: [["Customer CRM", RW], ["Marketing Automation", RW]], links: [], tools: [["Campaign API", "API"]], failing: ["Owner assigned", "Lifecycle policy", "Identity verified"] },
  { name: "Roaming Promo Agent", room: "Sales", platform: "Microsoft Copilot Studio", owner: "Consumer", tech: "M. Singh", identity: "Managed", data: "Roaming offers", risk: "Low", score: 8, status: "Inactive", last: "77 days ago", created: "2024-12-01", perms: [["Product Catalogue", R]], links: [], tools: [["Promo API", "API"]], failing: ["Lifecycle policy"] },
  // FINANCE
  { name: "Journal Agent", room: "Finance", platform: "Microsoft Foundry", owner: "Finance Operations", tech: "E. Chen", identity: "Managed", data: "ERP / general ledger", risk: "Low", score: 20, status: "Active", last: "15 min ago", created: "2025-02-26", perms: [["ERP", RW], ["SharePoint", R]], links: ["Revenue Assurance Agent"], tools: [["ERP API", "API"]] },
  { name: "Revenue Assurance Agent", room: "Finance", platform: "Microsoft Foundry", owner: "Finance Operations", tech: "E. Chen", identity: "Managed", data: "Billing / usage records", risk: "Low", score: 22, status: "Active", last: "7 min ago", created: "2025-01-15", perms: [["Billing Platform", R], ["ERP", R], ["OSS Telemetry", R]], links: ["Billing Assistant", "Journal Agent"], tools: [["Reconciliation MCP", "MCP"]] },
  { name: "Procurement Assistant", room: "Finance", platform: "Microsoft Copilot Studio", owner: "Procurement", tech: "H. Fortin", identity: "Managed", data: "Vendor / contract data", risk: "Low", score: 15, status: "Pending Approval", last: "Not yet active", created: "2026-10-30", perms: [["ERP", R], ["SharePoint", R]], links: [], tools: [["Vendor API", "API"]], failing: ["Lifecycle policy"] },
  { name: "Invoice Dispute Pilot", room: "Finance", platform: "Custom API", owner: "Billing Operations", tech: "L. Okafor", identity: "Managed", data: "Invoices", risk: "Low", score: 9, status: "Inactive", last: "103 days ago", created: "2024-11-20", perms: [["Billing Platform", R]], links: ["Billing Assistant"], tools: [["Dispute API", "API"]], failing: ["Lifecycle policy"] },
  { name: "Shadow Procurement Agent", room: "Finance", platform: "Custom API", owner: "Unassigned", tech: "Unknown", identity: "Unmanaged", data: "ERP / vendor payments", risk: "Critical", score: 94, status: "Review", last: "22 min ago", created: "2026-11-02", perms: [["ERP", ["READ", "WRITE", "EXECUTE", "ADMIN"]]], links: ["Journal Agent"], tools: [["Unregistered payment webhook", "API"]], failing: ["Identity verified", "Owner assigned", "Least privilege policy", "Approved data sources", "Human escalation configured"] },
  // MEDIA
  { name: "Sports Engagement Agent", room: "Media", platform: "Microsoft Copilot Studio", owner: "Media & Sports", tech: "C. Beaulieu", identity: "Managed", data: "Fan engagement / content", risk: "Low", score: 13, status: "Active", last: "1 min ago", created: "2025-09-05", perms: [["Content Library", R], ["Audience Analytics", R]], links: ["Advertising Optimization Agent"], tools: [["Stats Feed API", "API"]] },
  { name: "Advertising Optimization Agent", room: "Media", platform: "Google", owner: "Media & Sports", tech: "C. Beaulieu", identity: "Federated", data: "Ad inventory / audience", risk: "Low", score: 27, status: "Active", last: "10 min ago", created: "2025-07-23", perms: [["Audience Analytics", RW], ["Ad Platform", RWX]], links: ["Sports Engagement Agent", "Marketing Campaign Agent"], tools: [["Google Ads API", "API"]] },
  { name: "Marketing Campaign Agent", room: "Media", platform: "Salesforce", owner: "Marketing", tech: "Vendor-managed", identity: "External", data: "CRM / audience data", risk: "Medium", score: 52, status: "Active", last: "18 min ago", created: "2025-06-30", perms: [["Customer CRM", RW], ["Audience Analytics", RW]], links: ["Advertising Optimization Agent"], tools: [["Marketing Cloud API", "API"]], failing: ["Approved data sources"] },
  { name: "Highlights Clipper Agent", room: "Media", platform: "Microsoft Foundry", owner: "Media & Sports", tech: "C. Beaulieu", identity: "Managed", data: "Video assets", risk: "Low", score: 7, status: "Inactive", last: "88 days ago", created: "2025-01-09", perms: [["Content Library", RW]], links: [], tools: [["Video Indexer API", "API"]], failing: ["Lifecycle policy"] },
  // IT
  { name: "Service Desk Agent", room: "IT", platform: "ServiceNow", owner: "IT Operations", tech: "N. Abdi", identity: "Federated", data: "ITSM / employee data", risk: "Medium", score: 44, status: "Active", last: "Just now", created: "2025-01-20", perms: [["ServiceNow", RWX], ["Microsoft Graph", RW], ["Employee Directory", R]], links: ["Incident Response Agent", "Developer Agent"], tools: [["ServiceNow API", "API"], ["Graph MCP Server", "MCP"]], failing: ["Least privilege policy"] },
  { name: "Incident Response Agent", room: "IT", platform: "Microsoft Foundry", owner: "Security Operations", tech: "V. Morel", identity: "Managed", data: "Security alerts / logs", risk: "Low", score: 25, status: "Active", last: "Just now", created: "2025-02-04", perms: [["ServiceNow", RW], ["OSS Telemetry", R], ["Microsoft Graph", R]], links: ["Service Desk Agent", "Anomaly Detection Agent"], tools: [["SIEM API", "API"]] },
  { name: "Developer Agent", room: "IT", platform: "Anthropic", owner: "Engineering", tech: "B. Kowalski", identity: "External", data: "GitHub repositories", risk: "High", score: 82, status: "Review", last: "14 min ago", created: "2025-09-18", perms: [["GitHub", ["READ", "WRITE", "ADMIN"]], ["DevOps Pipelines", RWX], ["ServiceNow", R], ["Internal Documentation", R]], links: ["Service Desk Agent", "Change Management Agent"], tools: [["GitHub MCP Server", "MCP"], ["Azure DevOps API", "API"], ["Docs MCP Server", "MCP"]], failing: ["Least privilege policy"] },
];

const defaultIdentity = (a: Spec) =>
  `agent-${slug(a.name)}@agents.telco-demo.example`;

export const buildAgents = (): Agent[] =>
  specs.map((s) => {
    const policies = Object.fromEntries(POLICY_KEYS.map((k) => [k, !s.failing?.includes(k)])) as Agent["policies"];
    return {
      id: slug(s.name),
      name: s.name,
      room: s.room,
      platform: s.platform,
      owner: s.owner,
      techOwner: s.tech,
      identity: s.identity,
      agentIdentity: defaultIdentity(s),
      data: s.data,
      risk: s.risk,
      riskScore: s.score,
      status: s.status,
      lastActivity: s.last,
      created: s.created,
      permissions: s.perms.map(([system, perms]) => ({ system, perms })),
      connectedAgents: s.links.map(slug),
      tools: s.tools.map(([name, kind]) => ({ name, kind })),
      policies,
    };
  });

export const VENDOR_AGENT_ID = slug("Vendor Network Optimization Agent");

export const buildVendorAgent = (): Agent => ({
  id: VENDOR_AGENT_ID,
  name: "Vendor Network Optimization Agent",
  room: "Network",
  platform: "Third-party",
  owner: "Network Engineering",
  techOwner: "Vendor-managed",
  identity: "Managed",
  agentIdentity: "agent-vendor-network-optimization@agents.telco-demo.example",
  data: "OSS telemetry / network performance",
  risk: "Low",
  riskScore: 20,
  status: "Active",
  lastActivity: "Just now",
  created: "2026-11-13",
  permissions: [
    { system: "OSS Telemetry", perms: ["READ"] },
    { system: "Network Inventory", perms: ["READ"] },
    { system: "ServiceNow", perms: ["READ", "WRITE"] },
  ],
  connectedAgents: [slug("Network Operations Agent")],
  tools: [{ name: "Vendor Optimization API", kind: "API" }],
  policies: Object.fromEntries(POLICY_KEYS.map((k) => [k, true])) as Agent["policies"],
});

export const ROOM_META: Record<Room, { agents: number; healthy: number; attention: number; tone: "good" | "warn" | "bad" }> = {
  Customer: { agents: 124, healthy: 98, attention: 3, tone: "warn" },
  Network: { agents: 86, healthy: 99, attention: 2, tone: "good" },
  Sales: { agents: 78, healthy: 96, attention: 3, tone: "warn" },
  Finance: { agents: 52, healthy: 94, attention: 3, tone: "bad" },
  Media: { agents: 61, healthy: 97, attention: 1, tone: "good" },
  IT: { agents: 86, healthy: 95, attention: 2, tone: "warn" },
};

export const ROOM_COLORS: Record<Room, string> = {
  Customer: "#4aa3ff",
  Network: "#2dd4bf",
  Sales: "#a78bfa",
  Finance: "#fbbf24",
  Media: "#f472b6",
  IT: "#60a5fa",
};
