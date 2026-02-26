import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { FreeAgentClient } from "../client.js";

export function register(server: McpServer, client: FreeAgentClient): void {
  server.tool(
    "freeagent_recurring_invoices_list",
    "List recurring invoices",
    {
      view: z.enum(["draft", "active", "inactive"]).optional().describe("Filter recurring invoices by status"),
      contact: z.string().optional().describe("Filter by contact URI"),
      page: z.number().optional().describe("Page number for pagination"),
      per_page: z.number().optional().describe("Number of results per page"),
    },
    async (params) => {
      return client.formatResponse(await client.get("/recurring_invoices", params as Record<string, unknown>));
    }
  );

  server.tool(
    "freeagent_recurring_invoices_get",
    "Get a recurring invoice by ID",
    {
      id: z.string().describe("The ID of the recurring invoice to retrieve"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.get(`/recurring_invoices/${id}`));
    }
  );
}
