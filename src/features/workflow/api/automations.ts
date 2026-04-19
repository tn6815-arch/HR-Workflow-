/**
 * Mock GET /automations endpoint.
 * Returns the catalogue of automated actions available to the Automated Step node.
 */
import type { Automation } from "../types/workflow";

const MOCK_AUTOMATIONS: Automation[] = [
  { id: "send_email", label: "Send Email", params: ["to", "subject", "body"] },
  { id: "generate_doc", label: "Generate Document", params: ["template", "recipient"] },
  { id: "post_slack", label: "Post to Slack", params: ["channel", "message"] },
  { id: "update_workday", label: "Update Workday", params: ["employee_id", "field", "value"] },
  { id: "create_jira", label: "Create Jira Ticket", params: ["project", "summary", "assignee"] },
];

const NETWORK_DELAY_MS = 350;

export async function getAutomations(): Promise<Automation[]> {
  await new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY_MS));
  return MOCK_AUTOMATIONS;
}

export function getAutomationById(id: string | null | undefined): Automation | undefined {
  if (!id) return undefined;
  return MOCK_AUTOMATIONS.find((a) => a.id === id);
}
