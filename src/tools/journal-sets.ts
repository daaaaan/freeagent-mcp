import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { FreeAgentClient } from "../client.js";

export function register(server: McpServer, client: FreeAgentClient): void {
  server.tool(
    "freeagent_journal_sets_list",
    "List journal sets",
    {
      from_date: z.string().optional().describe("Return journal sets from this date (YYYY-MM-DD)"),
      to_date: z.string().optional().describe("Return journal sets up to this date (YYYY-MM-DD)"),
      updated_since: z.string().optional().describe("Return only journal sets updated since this date (ISO 8601)"),
      tag: z.string().optional().describe("Filter journal sets by tag"),
      page: z.number().optional().describe("Page number for pagination"),
      per_page: z.number().optional().describe("Number of results per page"),
    },
    async (params) => {
      return client.formatResponse(await client.get("/journal_sets", params as Record<string, unknown>));
    }
  );

  server.tool(
    "freeagent_journal_sets_get",
    "Get a journal set by ID",
    {
      id: z.string().describe("The ID of the journal set to retrieve"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.get(`/journal_sets/${id}`));
    }
  );

  server.tool(
    "freeagent_journal_sets_opening_balances",
    "Get opening balances journal set",
    {},
    async () => {
      return client.formatResponse(await client.get("/journal_sets/opening_balances"));
    }
  );

  server.tool(
    "freeagent_journal_sets_create",
    "Create a new journal set",
    {
      data: z.record(z.any()).describe("Journal set attributes such as description, dated_on, journal_entries, etc."),
    },
    async ({ data }) => {
      return client.formatResponse(await client.post("/journal_sets", { journal_set: data }));
    }
  );

  server.tool(
    "freeagent_journal_sets_update",
    "Update an existing journal set",
    {
      id: z.string().describe("The ID of the journal set to update"),
      data: z.record(z.any()).describe("Journal set attributes to update"),
    },
    async ({ id, data }) => {
      return client.formatResponse(await client.put(`/journal_sets/${id}`, { journal_set: data }));
    }
  );

  server.tool(
    "freeagent_journal_sets_delete",
    "Delete a journal set",
    {
      id: z.string().describe("The ID of the journal set to delete"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.del(`/journal_sets/${id}`));
    }
  );
}
