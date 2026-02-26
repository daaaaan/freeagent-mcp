import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { FreeAgentClient } from "../client.js";

export function register(server: McpServer, client: FreeAgentClient): void {
  server.tool(
    "freeagent_credit_notes_list",
    "List credit notes",
    {
      view: z.enum([
        "all",
        "recent_open_or_overdue",
        "open",
        "overdue",
        "draft",
        "refunded",
      ]).optional().describe("Filter credit notes by status"),
      contact: z.string().optional().describe("Filter by contact URI"),
      project: z.string().optional().describe("Filter by project URI"),
      nested_credit_note_items: z.boolean().optional().describe("Include nested credit note items in response"),
      sort: z.string().optional().describe("Field to sort results by"),
      updated_since: z.string().optional().describe("Return only credit notes updated since this date (ISO 8601)"),
      page: z.number().optional().describe("Page number for pagination"),
      per_page: z.number().optional().describe("Number of results per page"),
    },
    async (params) => {
      return client.formatResponse(await client.get("/credit_notes", params as Record<string, unknown>));
    }
  );

  server.tool(
    "freeagent_credit_notes_get",
    "Get a credit note by ID",
    {
      id: z.string().describe("The ID of the credit note to retrieve"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.get(`/credit_notes/${id}`));
    }
  );

  server.tool(
    "freeagent_credit_notes_get_pdf",
    "Get a credit note as a base64-encoded PDF",
    {
      id: z.string().describe("The ID of the credit note to retrieve as PDF"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.get(`/credit_notes/${id}/pdf`));
    }
  );

  server.tool(
    "freeagent_credit_notes_create",
    "Create a new credit note",
    {
      data: z.record(z.any()).describe("Credit note attributes such as contact, dated_on, credit_note_items, etc."),
    },
    async ({ data }) => {
      return client.formatResponse(await client.post("/credit_notes", { credit_note: data }));
    }
  );

  server.tool(
    "freeagent_credit_notes_update",
    "Update an existing credit note",
    {
      id: z.string().describe("The ID of the credit note to update"),
      data: z.record(z.any()).describe("Credit note attributes to update"),
    },
    async ({ id, data }) => {
      return client.formatResponse(await client.put(`/credit_notes/${id}`, { credit_note: data }));
    }
  );

  server.tool(
    "freeagent_credit_notes_delete",
    "Delete a credit note",
    {
      id: z.string().describe("The ID of the credit note to delete"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.del(`/credit_notes/${id}`));
    }
  );

  server.tool(
    "freeagent_credit_notes_send_email",
    "Send a credit note by email",
    {
      id: z.string().describe("The ID of the credit note to send"),
      data: z.record(z.any()).describe("Email params: email object with to, subject, body, etc."),
    },
    async ({ id, data }) => {
      return client.formatResponse(await client.post(`/credit_notes/${id}/send_email`, { credit_note: { email: data } }));
    }
  );

  server.tool(
    "freeagent_credit_notes_mark_as_sent",
    "Mark a credit note as sent",
    {
      id: z.string().describe("The ID of the credit note to mark as sent"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.put(`/credit_notes/${id}/transitions/mark_as_sent`));
    }
  );

  server.tool(
    "freeagent_credit_notes_mark_as_draft",
    "Mark a credit note as draft",
    {
      id: z.string().describe("The ID of the credit note to mark as draft"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.put(`/credit_notes/${id}/transitions/mark_as_draft`));
    }
  );

  server.tool(
    "freeagent_credit_note_reconciliations_list",
    "List credit note reconciliations",
    {
      updated_since: z.string().optional().describe("Return only reconciliations updated since this date (ISO 8601)"),
      from_date: z.string().optional().describe("Return reconciliations from this date (ISO 8601)"),
      to_date: z.string().optional().describe("Return reconciliations up to this date (ISO 8601)"),
      page: z.number().optional().describe("Page number for pagination"),
      per_page: z.number().optional().describe("Number of results per page"),
    },
    async (params) => {
      return client.formatResponse(await client.get("/credit_note_reconciliations", params as Record<string, unknown>));
    }
  );

  server.tool(
    "freeagent_credit_note_reconciliations_get",
    "Get a credit note reconciliation by ID",
    {
      id: z.string().describe("The ID of the credit note reconciliation to retrieve"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.get(`/credit_note_reconciliations/${id}`));
    }
  );

  server.tool(
    "freeagent_credit_note_reconciliations_create",
    "Create a new credit note reconciliation",
    {
      data: z.record(z.any()).describe("Credit note reconciliation attributes such as credit_note, bank_transaction, etc."),
    },
    async ({ data }) => {
      return client.formatResponse(await client.post("/credit_note_reconciliations", { credit_note_reconciliation: data }));
    }
  );

  server.tool(
    "freeagent_credit_note_reconciliations_update",
    "Update an existing credit note reconciliation",
    {
      id: z.string().describe("The ID of the credit note reconciliation to update"),
      data: z.record(z.any()).describe("Credit note reconciliation attributes to update"),
    },
    async ({ id, data }) => {
      return client.formatResponse(await client.put(`/credit_note_reconciliations/${id}`, { credit_note_reconciliation: data }));
    }
  );

  server.tool(
    "freeagent_credit_note_reconciliations_delete",
    "Delete a credit note reconciliation",
    {
      id: z.string().describe("The ID of the credit note reconciliation to delete"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.del(`/credit_note_reconciliations/${id}`));
    }
  );
}
