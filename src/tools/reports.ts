import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { FreeAgentClient } from "../client.js";

export function register(server: McpServer, client: FreeAgentClient): void {
  server.tool(
    "freeagent_profit_and_loss",
    "Get a profit and loss summary report",
    {
      from_date: z.string().optional().describe("Report start date (YYYY-MM-DD)"),
      to_date: z.string().optional().describe("Report end date (YYYY-MM-DD)"),
      accounting_period: z.string().optional().describe("Accounting period, e.g. '2022/23'"),
    },
    async (params) => {
      return client.formatResponse(await client.get("/accounting/profit_and_loss/summary", params as Record<string, unknown>));
    }
  );

  server.tool(
    "freeagent_balance_sheet",
    "Get a balance sheet report",
    {
      as_at_date: z.string().optional().describe("Balance sheet date (YYYY-MM-DD)"),
    },
    async (params) => {
      return client.formatResponse(await client.get("/accounting/balance_sheet", params as Record<string, unknown>));
    }
  );

  server.tool(
    "freeagent_balance_sheet_opening_balances",
    "Get balance sheet opening balances",
    {},
    async () => {
      return client.formatResponse(await client.get("/accounting/balance_sheet/opening_balances"));
    }
  );

  server.tool(
    "freeagent_trial_balance",
    "Get a trial balance summary report",
    {
      from_date: z.string().optional().describe("Report start date (YYYY-MM-DD)"),
      to_date: z.string().optional().describe("Report end date (YYYY-MM-DD)"),
    },
    async (params) => {
      return client.formatResponse(await client.get("/accounting/trial_balance/summary", params as Record<string, unknown>));
    }
  );

  server.tool(
    "freeagent_trial_balance_opening_balances",
    "Get trial balance opening balances",
    {},
    async () => {
      return client.formatResponse(await client.get("/accounting/trial_balance/summary/opening_balances"));
    }
  );

  server.tool(
    "freeagent_cashflow",
    "Get a cashflow report",
    {
      from_date: z.string().describe("Report start date (YYYY-MM-DD)"),
      to_date: z.string().describe("Report end date (YYYY-MM-DD)"),
    },
    async (params) => {
      return client.formatResponse(await client.get("/cashflow", params as Record<string, unknown>));
    }
  );

  server.tool(
    "freeagent_accounting_transactions_list",
    "List accounting transactions",
    {
      from_date: z.string().optional().describe("Return transactions from this date (YYYY-MM-DD)"),
      to_date: z.string().optional().describe("Return transactions up to this date (YYYY-MM-DD)"),
      nominal_code: z.string().optional().describe("Filter by nominal code"),
      page: z.number().optional().describe("Page number for pagination"),
      per_page: z.number().optional().describe("Number of results per page"),
    },
    async (params) => {
      return client.formatResponse(await client.get("/accounting/transactions", params as Record<string, unknown>));
    }
  );

  server.tool(
    "freeagent_accounting_transactions_get",
    "Get an accounting transaction by ID",
    {
      id: z.string().describe("The ID of the accounting transaction to retrieve"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.get(`/accounting/transactions/${id}`));
    }
  );
}
