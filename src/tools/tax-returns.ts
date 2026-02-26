import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { FreeAgentClient } from "../client.js";

export function register(server: McpServer, client: FreeAgentClient): void {
  // VAT Returns
  server.tool(
    "freeagent_vat_returns_list",
    "List VAT returns",
    {
      page: z.number().optional().describe("Page number for pagination"),
      per_page: z.number().optional().describe("Number of results per page"),
    },
    async (params) => {
      return client.formatResponse(await client.get("/vat_returns", params as Record<string, unknown>));
    }
  );

  server.tool(
    "freeagent_vat_returns_get",
    "Get a VAT return by period end date",
    {
      period_ends_on: z.string().describe("Period end date (YYYY-MM-DD)"),
    },
    async ({ period_ends_on }) => {
      return client.formatResponse(await client.get(`/vat_returns/${period_ends_on}`));
    }
  );

  server.tool(
    "freeagent_vat_returns_mark_as_filed",
    "Mark a VAT return as filed",
    {
      period_ends_on: z.string().describe("Period end date (YYYY-MM-DD)"),
    },
    async ({ period_ends_on }) => {
      return client.formatResponse(await client.put(`/vat_returns/${period_ends_on}/mark_as_filed`));
    }
  );

  server.tool(
    "freeagent_vat_returns_mark_as_unfiled",
    "Mark a VAT return as unfiled",
    {
      period_ends_on: z.string().describe("Period end date (YYYY-MM-DD)"),
    },
    async ({ period_ends_on }) => {
      return client.formatResponse(await client.put(`/vat_returns/${period_ends_on}/mark_as_unfiled`));
    }
  );

  server.tool(
    "freeagent_vat_returns_payment_mark_as_paid",
    "Mark a VAT return payment as paid",
    {
      period_ends_on: z.string().describe("Period end date (YYYY-MM-DD)"),
      payment_date: z.string().describe("Payment date (YYYY-MM-DD)"),
    },
    async ({ period_ends_on, payment_date }) => {
      return client.formatResponse(await client.put(`/vat_returns/${period_ends_on}/payments/${payment_date}/mark_as_paid`));
    }
  );

  server.tool(
    "freeagent_vat_returns_payment_mark_as_unpaid",
    "Mark a VAT return payment as unpaid",
    {
      period_ends_on: z.string().describe("Period end date (YYYY-MM-DD)"),
      payment_date: z.string().describe("Payment date (YYYY-MM-DD)"),
    },
    async ({ period_ends_on, payment_date }) => {
      return client.formatResponse(await client.put(`/vat_returns/${period_ends_on}/payments/${payment_date}/mark_as_unpaid`));
    }
  );

  // Corporation Tax Returns
  server.tool(
    "freeagent_corporation_tax_returns_list",
    "List corporation tax returns",
    {},
    async () => {
      return client.formatResponse(await client.get("/corporation_tax_returns"));
    }
  );

  server.tool(
    "freeagent_corporation_tax_returns_get",
    "Get a corporation tax return by period end date",
    {
      period_ends_on: z.string().describe("Period end date (YYYY-MM-DD)"),
    },
    async ({ period_ends_on }) => {
      return client.formatResponse(await client.get(`/corporation_tax_returns/${period_ends_on}`));
    }
  );

  server.tool(
    "freeagent_corporation_tax_returns_mark_as_filed",
    "Mark a corporation tax return as filed",
    {
      period_ends_on: z.string().describe("Period end date (YYYY-MM-DD)"),
    },
    async ({ period_ends_on }) => {
      return client.formatResponse(await client.put(`/corporation_tax_returns/${period_ends_on}/mark_as_filed`));
    }
  );

  server.tool(
    "freeagent_corporation_tax_returns_mark_as_unfiled",
    "Mark a corporation tax return as unfiled",
    {
      period_ends_on: z.string().describe("Period end date (YYYY-MM-DD)"),
    },
    async ({ period_ends_on }) => {
      return client.formatResponse(await client.put(`/corporation_tax_returns/${period_ends_on}/mark_as_unfiled`));
    }
  );

  server.tool(
    "freeagent_corporation_tax_returns_mark_as_paid",
    "Mark a corporation tax return as paid",
    {
      period_ends_on: z.string().describe("Period end date (YYYY-MM-DD)"),
    },
    async ({ period_ends_on }) => {
      return client.formatResponse(await client.put(`/corporation_tax_returns/${period_ends_on}/mark_as_paid`));
    }
  );

  server.tool(
    "freeagent_corporation_tax_returns_mark_as_unpaid",
    "Mark a corporation tax return as unpaid",
    {
      period_ends_on: z.string().describe("Period end date (YYYY-MM-DD)"),
    },
    async ({ period_ends_on }) => {
      return client.formatResponse(await client.put(`/corporation_tax_returns/${period_ends_on}/mark_as_unpaid`));
    }
  );

  // Self Assessment Returns
  server.tool(
    "freeagent_self_assessment_returns_list",
    "List self assessment returns for a user",
    {
      user_id: z.string().describe("The user ID to list self assessment returns for"),
    },
    async ({ user_id }) => {
      return client.formatResponse(await client.get(`/users/${user_id}/self_assessment_returns`));
    }
  );

  server.tool(
    "freeagent_self_assessment_returns_get",
    "Get a self assessment return by user and period end date",
    {
      user_id: z.string().describe("The user ID"),
      period_ends_on: z.string().describe("Period end date (YYYY-MM-DD)"),
    },
    async ({ user_id, period_ends_on }) => {
      return client.formatResponse(await client.get(`/users/${user_id}/self_assessment_returns/${period_ends_on}`));
    }
  );

  server.tool(
    "freeagent_self_assessment_returns_mark_as_filed",
    "Mark a self assessment return as filed",
    {
      user_id: z.string().describe("The user ID"),
      period_ends_on: z.string().describe("Period end date (YYYY-MM-DD)"),
    },
    async ({ user_id, period_ends_on }) => {
      return client.formatResponse(await client.put(`/users/${user_id}/self_assessment_returns/${period_ends_on}/mark_as_filed`));
    }
  );

  server.tool(
    "freeagent_self_assessment_returns_mark_as_unfiled",
    "Mark a self assessment return as unfiled",
    {
      user_id: z.string().describe("The user ID"),
      period_ends_on: z.string().describe("Period end date (YYYY-MM-DD)"),
    },
    async ({ user_id, period_ends_on }) => {
      return client.formatResponse(await client.put(`/users/${user_id}/self_assessment_returns/${period_ends_on}/mark_as_unfiled`));
    }
  );

  server.tool(
    "freeagent_self_assessment_returns_payment_mark_as_paid",
    "Mark a self assessment return payment as paid",
    {
      user_id: z.string().describe("The user ID"),
      period_ends_on: z.string().describe("Period end date (YYYY-MM-DD)"),
      payment_date: z.string().describe("Payment date (YYYY-MM-DD)"),
    },
    async ({ user_id, period_ends_on, payment_date }) => {
      return client.formatResponse(await client.put(`/users/${user_id}/self_assessment_returns/${period_ends_on}/payments/${payment_date}/mark_as_paid`));
    }
  );

  server.tool(
    "freeagent_self_assessment_returns_payment_mark_as_unpaid",
    "Mark a self assessment return payment as unpaid",
    {
      user_id: z.string().describe("The user ID"),
      period_ends_on: z.string().describe("Period end date (YYYY-MM-DD)"),
      payment_date: z.string().describe("Payment date (YYYY-MM-DD)"),
    },
    async ({ user_id, period_ends_on, payment_date }) => {
      return client.formatResponse(await client.put(`/users/${user_id}/self_assessment_returns/${period_ends_on}/payments/${payment_date}/mark_as_unpaid`));
    }
  );

  // Sales Tax Periods (US/Universal)
  server.tool(
    "freeagent_sales_tax_periods_list",
    "List sales tax periods",
    {
      page: z.number().optional().describe("Page number for pagination"),
      per_page: z.number().optional().describe("Number of results per page"),
    },
    async (params) => {
      return client.formatResponse(await client.get("/sales_tax_periods", params as Record<string, unknown>));
    }
  );

  server.tool(
    "freeagent_sales_tax_periods_get",
    "Get a sales tax period by ID",
    {
      id: z.string().describe("The ID of the sales tax period to retrieve"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.get(`/sales_tax_periods/${id}`));
    }
  );

  server.tool(
    "freeagent_sales_tax_periods_create",
    "Create a new sales tax period",
    {
      data: z.record(z.any()).describe("Sales tax period attributes such as from_date, to_date, etc."),
    },
    async ({ data }) => {
      return client.formatResponse(await client.post("/sales_tax_periods", { sales_tax_period: data }));
    }
  );

  server.tool(
    "freeagent_sales_tax_periods_update",
    "Update an existing sales tax period",
    {
      id: z.string().describe("The ID of the sales tax period to update"),
      data: z.record(z.any()).describe("Sales tax period attributes to update"),
    },
    async ({ id, data }) => {
      return client.formatResponse(await client.put(`/sales_tax_periods/${id}`, { sales_tax_period: data }));
    }
  );

  server.tool(
    "freeagent_sales_tax_periods_delete",
    "Delete a sales tax period",
    {
      id: z.string().describe("The ID of the sales tax period to delete"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.del(`/sales_tax_periods/${id}`));
    }
  );

  // Final Accounts Reports
  server.tool(
    "freeagent_final_accounts_reports_list",
    "List final accounts reports",
    {
      page: z.number().optional().describe("Page number for pagination"),
      per_page: z.number().optional().describe("Number of results per page"),
    },
    async (params) => {
      return client.formatResponse(await client.get("/final_accounts_reports", params as Record<string, unknown>));
    }
  );

  server.tool(
    "freeagent_final_accounts_reports_get",
    "Get a final accounts report by period end date",
    {
      period_ends_on: z.string().describe("Period end date (YYYY-MM-DD)"),
    },
    async ({ period_ends_on }) => {
      return client.formatResponse(await client.get(`/final_accounts_reports/${period_ends_on}`));
    }
  );

  server.tool(
    "freeagent_final_accounts_reports_mark_as_filed",
    "Mark a final accounts report as filed",
    {
      period_ends_on: z.string().describe("Period end date (YYYY-MM-DD)"),
    },
    async ({ period_ends_on }) => {
      return client.formatResponse(await client.put(`/final_accounts_reports/${period_ends_on}/mark_as_filed`));
    }
  );

  server.tool(
    "freeagent_final_accounts_reports_mark_as_unfiled",
    "Mark a final accounts report as unfiled",
    {
      period_ends_on: z.string().describe("Period end date (YYYY-MM-DD)"),
    },
    async ({ period_ends_on }) => {
      return client.formatResponse(await client.put(`/final_accounts_reports/${period_ends_on}/mark_as_unfiled`));
    }
  );
}
