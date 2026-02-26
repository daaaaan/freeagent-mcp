import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { FreeAgentClient } from "../client.js";

export function register(server: McpServer, client: FreeAgentClient): void {
  server.tool(
    "freeagent_invoices_list",
    "List invoices",
    {
      view: z.enum([
        "all",
        "recent_open_or_overdue",
        "open",
        "overdue",
        "draft",
        "paid",
        "scheduled_to_email",
      ]).optional().describe("Filter invoices by status"),
      contact: z.string().optional().describe("Filter by contact URI"),
      project: z.string().optional().describe("Filter by project URI"),
      nested_invoice_items: z.boolean().optional().describe("Include nested invoice items in response"),
      sort: z.string().optional().describe("Field to sort results by"),
      updated_since: z.string().optional().describe("Return only invoices updated since this date (ISO 8601)"),
      page: z.number().optional().describe("Page number for pagination"),
      per_page: z.number().optional().describe("Number of results per page"),
    },
    async (params) => {
      return client.formatResponse(await client.get("/invoices", params as Record<string, unknown>));
    }
  );

  server.tool(
    "freeagent_invoices_get",
    "Get an invoice by ID",
    {
      id: z.string().describe("The ID of the invoice to retrieve"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.get(`/invoices/${id}`));
    }
  );

  server.tool(
    "freeagent_invoices_get_pdf",
    "Get an invoice as a base64-encoded PDF",
    {
      id: z.string().describe("The ID of the invoice to retrieve as PDF"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.get(`/invoices/${id}/pdf`));
    }
  );

  server.tool(
    "freeagent_invoices_create",
    "Create a new invoice",
    {
      data: z.record(z.any()).describe("Invoice attributes such as contact, dated_on, payment_terms_in_days, invoice_items, etc."),
    },
    async ({ data }) => {
      return client.formatResponse(await client.post("/invoices", { invoice: data }));
    }
  );

  server.tool(
    "freeagent_invoices_update",
    "Update an existing invoice",
    {
      id: z.string().describe("The ID of the invoice to update"),
      data: z.record(z.any()).describe("Invoice attributes to update"),
    },
    async ({ id, data }) => {
      return client.formatResponse(await client.put(`/invoices/${id}`, { invoice: data }));
    }
  );

  server.tool(
    "freeagent_invoices_delete",
    "Delete an invoice",
    {
      id: z.string().describe("The ID of the invoice to delete"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.del(`/invoices/${id}`));
    }
  );

  server.tool(
    "freeagent_invoices_mark_as_sent",
    "Mark an invoice as sent",
    {
      id: z.string().describe("The ID of the invoice to mark as sent"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.put(`/invoices/${id}/transitions/mark_as_sent`));
    }
  );

  server.tool(
    "freeagent_invoices_mark_as_scheduled",
    "Mark an invoice as scheduled to be sent",
    {
      id: z.string().describe("The ID of the invoice to mark as scheduled"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.put(`/invoices/${id}/transitions/mark_as_scheduled`));
    }
  );

  server.tool(
    "freeagent_invoices_mark_as_draft",
    "Mark an invoice as draft",
    {
      id: z.string().describe("The ID of the invoice to mark as draft"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.put(`/invoices/${id}/transitions/mark_as_draft`));
    }
  );

  server.tool(
    "freeagent_invoices_mark_as_cancelled",
    "Mark an invoice as cancelled",
    {
      id: z.string().describe("The ID of the invoice to mark as cancelled"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.put(`/invoices/${id}/transitions/mark_as_cancelled`));
    }
  );

  server.tool(
    "freeagent_invoices_convert_to_credit_note",
    "Convert an invoice to a credit note",
    {
      id: z.string().describe("The ID of the invoice to convert to a credit note"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.put(`/invoices/${id}/transitions/convert_to_credit_note`));
    }
  );

  server.tool(
    "freeagent_invoices_duplicate",
    "Duplicate an invoice",
    {
      id: z.string().describe("The ID of the invoice to duplicate"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.post(`/invoices/${id}/duplicate`));
    }
  );

  server.tool(
    "freeagent_invoices_send_email",
    "Send an invoice by email",
    {
      id: z.string().describe("The ID of the invoice to send"),
      data: z.record(z.any()).describe("Email params: email object with to, subject, body, etc."),
    },
    async ({ id, data }) => {
      return client.formatResponse(await client.post(`/invoices/${id}/send_email`, { invoice: { email: data } }));
    }
  );

  server.tool(
    "freeagent_invoices_timeline",
    "Get the invoice timeline",
    {},
    async () => {
      return client.formatResponse(await client.get("/invoices/timeline"));
    }
  );

  server.tool(
    "freeagent_invoices_default_text_get",
    "Get the default additional text for invoices",
    {},
    async () => {
      return client.formatResponse(await client.get("/invoices/default_additional_text"));
    }
  );

  server.tool(
    "freeagent_invoices_default_text_update",
    "Update the default additional text for invoices",
    {
      data: z.record(z.any()).describe("Default additional text attributes to update"),
    },
    async ({ data }) => {
      return client.formatResponse(await client.put("/invoices/default_additional_text", data));
    }
  );

  server.tool(
    "freeagent_invoices_default_text_delete",
    "Delete the default additional text for invoices",
    {},
    async () => {
      return client.formatResponse(await client.del("/invoices/default_additional_text"));
    }
  );
}
