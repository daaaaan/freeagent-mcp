import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { FreeAgentClient } from "../client.js";

export function register(server: McpServer, client: FreeAgentClient): void {
  server.tool(
    "freeagent_bank_accounts_list",
    "List bank accounts",
    {
      view: z.enum(["standard_bank_accounts", "credit_card_accounts", "paypal_accounts"]).optional().describe("Filter bank accounts by type"),
      page: z.number().optional().describe("Page number for pagination"),
      per_page: z.number().optional().describe("Number of results per page"),
    },
    async (params) => {
      return client.formatResponse(await client.get("/bank_accounts", params as Record<string, unknown>));
    }
  );

  server.tool(
    "freeagent_bank_accounts_get",
    "Get a bank account by ID",
    {
      id: z.string().describe("The ID of the bank account to retrieve"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.get(`/bank_accounts/${id}`));
    }
  );

  server.tool(
    "freeagent_bank_accounts_create",
    "Create a new bank account",
    {
      data: z.record(z.any()).describe("Bank account attributes. Required: name, currency, account_type."),
    },
    async ({ data }) => {
      return client.formatResponse(await client.post("/bank_accounts", { bank_account: data }));
    }
  );

  server.tool(
    "freeagent_bank_accounts_update",
    "Update an existing bank account",
    {
      id: z.string().describe("The ID of the bank account to update"),
      data: z.record(z.any()).describe("Bank account attributes to update"),
    },
    async ({ id, data }) => {
      return client.formatResponse(await client.put(`/bank_accounts/${id}`, { bank_account: data }));
    }
  );

  server.tool(
    "freeagent_bank_accounts_delete",
    "Delete a bank account",
    {
      id: z.string().describe("The ID of the bank account to delete"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.del(`/bank_accounts/${id}`));
    }
  );
}
