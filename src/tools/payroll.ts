import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { FreeAgentClient } from "../client.js";

export function register(server: McpServer, client: FreeAgentClient): void {
  server.tool(
    "freeagent_payroll_list_periods",
    "List payroll periods for a tax year",
    {
      year: z.string().describe("Tax year end, e.g. '2026' for the 2025/26 tax year"),
    },
    async ({ year }) => {
      return client.formatResponse(await client.get(`/payroll/${year}`));
    }
  );

  server.tool(
    "freeagent_payroll_list_payslips",
    "List payslips for a specific payroll period",
    {
      year: z.string().describe("Tax year end, e.g. '2026' for the 2025/26 tax year"),
      period: z.string().describe("Period number 0-11"),
    },
    async ({ year, period }) => {
      return client.formatResponse(await client.get(`/payroll/${year}/${period}`));
    }
  );

  server.tool(
    "freeagent_payroll_mark_as_paid",
    "Mark a payroll payment as paid",
    {
      year: z.string().describe("Tax year end, e.g. '2026'"),
      payment_date: z.string().describe("The payment date (YYYY-MM-DD)"),
    },
    async ({ year, payment_date }) => {
      return client.formatResponse(await client.put(`/payroll/${year}/payments/${payment_date}/mark_as_paid`));
    }
  );

  server.tool(
    "freeagent_payroll_mark_as_unpaid",
    "Mark a payroll payment as unpaid",
    {
      year: z.string().describe("Tax year end, e.g. '2026'"),
      payment_date: z.string().describe("The payment date (YYYY-MM-DD)"),
    },
    async ({ year, payment_date }) => {
      return client.formatResponse(await client.put(`/payroll/${year}/payments/${payment_date}/mark_as_unpaid`));
    }
  );

  server.tool(
    "freeagent_payroll_profiles_list",
    "List payroll profiles for a tax year",
    {
      year: z.string().describe("Tax year end, e.g. '2026' for the 2025/26 tax year"),
      user: z.string().optional().describe("User URI to filter payroll profiles"),
    },
    async ({ year, user }) => {
      const queryParams: Record<string, unknown> = {};
      if (user) queryParams.user = user;
      return client.formatResponse(await client.get(`/payroll_profiles/${year}`, queryParams));
    }
  );

  server.tool(
    "freeagent_cis_bands_list",
    "List CIS (Construction Industry Scheme) tax bands",
    {},
    async () => {
      return client.formatResponse(await client.get("/cis_bands"));
    }
  );
}
