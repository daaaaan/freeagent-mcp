import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { FreeAgentClient } from "../client.js";

export function register(server: McpServer, client: FreeAgentClient): void {
  server.tool(
    "freeagent_contacts_list",
    "List contacts",
    {
      view: z.enum([
        "all",
        "active",
        "clients",
        "suppliers",
        "active_projects",
        "completed_projects",
        "open_clients",
        "open_suppliers",
        "hidden",
      ]).optional().describe("Filter contacts by type or status"),
      sort: z.string().optional().describe("Field to sort results by"),
      updated_since: z.string().optional().describe("Return only contacts updated since this date (ISO 8601)"),
      page: z.number().optional().describe("Page number for pagination"),
      per_page: z.number().optional().describe("Number of results per page"),
    },
    async (params) => {
      return client.formatResponse(await client.get("/contacts", params as Record<string, unknown>));
    }
  );

  server.tool(
    "freeagent_contacts_get",
    "Get a contact by ID",
    {
      id: z.string().describe("The ID of the contact to retrieve"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.get(`/contacts/${id}`));
    }
  );

  server.tool(
    "freeagent_contacts_create",
    "Create a new contact. Requires either first_name and last_name, or organisation_name.",
    {
      data: z.record(z.any()).describe("Contact attributes. Provide first_name + last_name for individuals, or organisation_name for organisations."),
    },
    async ({ data }) => {
      return client.formatResponse(await client.post("/contacts", { contact: data }));
    }
  );

  server.tool(
    "freeagent_contacts_update",
    "Update an existing contact",
    {
      id: z.string().describe("The ID of the contact to update"),
      data: z.record(z.any()).describe("Contact attributes to update"),
    },
    async ({ id, data }) => {
      return client.formatResponse(await client.put(`/contacts/${id}`, { contact: data }));
    }
  );

  server.tool(
    "freeagent_contacts_delete",
    "Delete a contact",
    {
      id: z.string().describe("The ID of the contact to delete"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.del(`/contacts/${id}`));
    }
  );
}
