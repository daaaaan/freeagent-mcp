import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { FreeAgentClient } from "../client.js";

export function register(server: McpServer, client: FreeAgentClient): void {
  server.tool(
    "freeagent_expenses_list",
    "List expenses",
    {
      view: z.enum(["recent", "recurring"]).optional().describe("Filter expenses by type"),
      project: z.string().optional().describe("Filter by project URI"),
      from_date: z.string().optional().describe("Return expenses from this date (ISO 8601)"),
      to_date: z.string().optional().describe("Return expenses up to this date (ISO 8601)"),
      updated_since: z.string().optional().describe("Return only expenses updated since this date (ISO 8601)"),
      page: z.number().optional().describe("Page number for pagination"),
      per_page: z.number().optional().describe("Number of results per page"),
    },
    async (params) => {
      return client.formatResponse(await client.get("/expenses", params as Record<string, unknown>));
    }
  );

  server.tool(
    "freeagent_expenses_get",
    "Get an expense by ID",
    {
      id: z.string().describe("The ID of the expense to retrieve"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.get(`/expenses/${id}`));
    }
  );

  server.tool(
    "freeagent_expenses_create",
    "Create a new expense. Requires user URI, category, dated_on, and gross_value.",
    {
      data: z.record(z.any()).describe("Expense attributes. Required: user (URI), category, dated_on, gross_value."),
    },
    async ({ data }) => {
      return client.formatResponse(await client.post("/expenses", { expense: data }));
    }
  );

  server.tool(
    "freeagent_expenses_create_batch",
    "Create multiple expenses in a single request",
    {
      expenses: z.array(z.record(z.any())).describe("Array of expense objects. Each requires: user (URI), category, dated_on, gross_value."),
    },
    async ({ expenses }) => {
      return client.formatResponse(await client.post("/expenses", { expenses }));
    }
  );

  server.tool(
    "freeagent_expenses_update",
    "Update an existing expense",
    {
      id: z.string().describe("The ID of the expense to update"),
      data: z.record(z.any()).describe("Expense attributes to update"),
    },
    async ({ id, data }) => {
      return client.formatResponse(await client.put(`/expenses/${id}`, { expense: data }));
    }
  );

  server.tool(
    "freeagent_expenses_delete",
    "Delete an expense",
    {
      id: z.string().describe("The ID of the expense to delete"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.del(`/expenses/${id}`));
    }
  );

  server.tool(
    "freeagent_expenses_mileage_settings",
    "Get mileage settings for expense calculations",
    {},
    async () => {
      return client.formatResponse(await client.get("/expenses/mileage_settings"));
    }
  );
}
