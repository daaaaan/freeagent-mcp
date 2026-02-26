import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { FreeAgentClient } from "../client.js";

export function register(server: McpServer, client: FreeAgentClient): void {
  server.tool(
    "freeagent_bills_list",
    "List bills",
    {
      view: z.string().optional().describe("Filter bills by status or type"),
      contact: z.string().optional().describe("Filter by contact URI"),
      project: z.string().optional().describe("Filter by project URI"),
      from_date: z.string().optional().describe("Return bills from this date (ISO 8601)"),
      to_date: z.string().optional().describe("Return bills up to this date (ISO 8601)"),
      updated_since: z.string().optional().describe("Return only bills updated since this date (ISO 8601)"),
      nested_bill_items: z.boolean().optional().describe("Include nested bill items in the response"),
      page: z.number().optional().describe("Page number for pagination"),
      per_page: z.number().optional().describe("Number of results per page"),
    },
    async (params) => {
      return client.formatResponse(await client.get("/bills", params as Record<string, unknown>));
    }
  );

  server.tool(
    "freeagent_bills_get",
    "Get a bill by ID",
    {
      id: z.string().describe("The ID of the bill to retrieve"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.get(`/bills/${id}`));
    }
  );

  server.tool(
    "freeagent_bills_create",
    "Create a new bill. Requires contact URI, reference, dated_on, due_on, and bill_items array.",
    {
      data: z.record(z.any()).describe("Bill attributes. Required: contact (URI), reference, dated_on, due_on, bill_items (array of line items with description, quantity, price, category)."),
    },
    async ({ data }) => {
      return client.formatResponse(await client.post("/bills", { bill: data }));
    }
  );

  server.tool(
    "freeagent_bills_update",
    "Update an existing bill",
    {
      id: z.string().describe("The ID of the bill to update"),
      data: z.record(z.any()).describe("Bill attributes to update"),
    },
    async ({ id, data }) => {
      return client.formatResponse(await client.put(`/bills/${id}`, { bill: data }));
    }
  );

  server.tool(
    "freeagent_bills_delete",
    "Delete a bill",
    {
      id: z.string().describe("The ID of the bill to delete"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.del(`/bills/${id}`));
    }
  );
}
