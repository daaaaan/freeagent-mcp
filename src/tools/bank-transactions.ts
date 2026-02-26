import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { FreeAgentClient } from "../client.js";

export function register(server: McpServer, client: FreeAgentClient): void {
  // Bank Transactions

  server.tool(
    "freeagent_bank_transactions_list",
    "List bank transactions for a bank account",
    {
      bank_account: z.string().describe("Bank account URI (required)"),
      view: z.enum(["all", "unexplained", "explained", "manual", "imported", "marked_for_review"]).optional().describe("Filter transactions by status"),
      from_date: z.string().optional().describe("Return transactions from this date (ISO 8601)"),
      to_date: z.string().optional().describe("Return transactions up to this date (ISO 8601)"),
      updated_since: z.string().optional().describe("Return only transactions updated since this date (ISO 8601)"),
      page: z.number().optional().describe("Page number for pagination"),
      per_page: z.number().optional().describe("Number of results per page"),
    },
    async (params) => {
      return client.formatResponse(await client.get("/bank_transactions", params as Record<string, unknown>));
    }
  );

  server.tool(
    "freeagent_bank_transactions_get",
    "Get a bank transaction by ID",
    {
      id: z.string().describe("The ID of the bank transaction to retrieve"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.get(`/bank_transactions/${id}`));
    }
  );

  server.tool(
    "freeagent_bank_transactions_delete",
    "Delete a bank transaction",
    {
      id: z.string().describe("The ID of the bank transaction to delete"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.del(`/bank_transactions/${id}`));
    }
  );

  server.tool(
    "freeagent_bank_transactions_upload_statement",
    "Upload a bank statement to create bank transactions",
    {
      bank_account: z.string().describe("Bank account URI"),
      transactions: z.array(z.record(z.any())).describe("Array of transaction objects with dated_on, description, amount"),
    },
    async ({ bank_account, transactions }) => {
      return client.formatResponse(await client.post("/bank_transactions/statement", {
        statement: {
          bank_account,
          bank_transactions: transactions,
        },
      }));
    }
  );

  // Bank Transaction Explanations

  server.tool(
    "freeagent_bank_transaction_explanations_list",
    "List bank transaction explanations for a bank account",
    {
      bank_account: z.string().describe("Bank account URI (required)"),
      from_date: z.string().optional().describe("Return explanations from this date (ISO 8601)"),
      to_date: z.string().optional().describe("Return explanations up to this date (ISO 8601)"),
      updated_since: z.string().optional().describe("Return only explanations updated since this date (ISO 8601)"),
      page: z.number().optional().describe("Page number for pagination"),
      per_page: z.number().optional().describe("Number of results per page"),
    },
    async (params) => {
      return client.formatResponse(await client.get("/bank_transaction_explanations", params as Record<string, unknown>));
    }
  );

  server.tool(
    "freeagent_bank_transaction_explanations_get",
    "Get a bank transaction explanation by ID",
    {
      id: z.string().describe("The ID of the bank transaction explanation to retrieve"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.get(`/bank_transaction_explanations/${id}`));
    }
  );

  server.tool(
    "freeagent_bank_transaction_explanations_create",
    "Create a new bank transaction explanation",
    {
      data: z.record(z.any()).describe("Bank transaction explanation attributes. Required: bank_transaction (URI), paid_invoice or category and other fields depending on explanation type."),
    },
    async ({ data }) => {
      return client.formatResponse(await client.post("/bank_transaction_explanations", { bank_transaction_explanation: data }));
    }
  );

  server.tool(
    "freeagent_bank_transaction_explanations_update",
    "Update an existing bank transaction explanation",
    {
      id: z.string().describe("The ID of the bank transaction explanation to update"),
      data: z.record(z.any()).describe("Bank transaction explanation attributes to update"),
    },
    async ({ id, data }) => {
      return client.formatResponse(await client.put(`/bank_transaction_explanations/${id}`, { bank_transaction_explanation: data }));
    }
  );

  server.tool(
    "freeagent_bank_transaction_explanations_delete",
    "Delete a bank transaction explanation",
    {
      id: z.string().describe("The ID of the bank transaction explanation to delete"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.del(`/bank_transaction_explanations/${id}`));
    }
  );

  // Bank Feeds

  server.tool(
    "freeagent_bank_feeds_list",
    "List bank feeds",
    {
      page: z.number().optional().describe("Page number for pagination"),
      per_page: z.number().optional().describe("Number of results per page"),
    },
    async (params) => {
      return client.formatResponse(await client.get("/bank_feeds", params as Record<string, unknown>));
    }
  );

  server.tool(
    "freeagent_bank_feeds_get",
    "Get a bank feed by ID",
    {
      id: z.string().describe("The ID of the bank feed to retrieve"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.get(`/bank_feeds/${id}`));
    }
  );
}
