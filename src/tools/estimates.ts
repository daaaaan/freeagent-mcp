import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { FreeAgentClient } from "../client.js";

export function register(server: McpServer, client: FreeAgentClient): void {
  server.tool(
    "freeagent_estimates_list",
    "List estimates",
    {
      contact: z.string().optional().describe("Filter by contact URI"),
      project: z.string().optional().describe("Filter by project URI"),
      invoice: z.string().optional().describe("Filter by invoice URI"),
      nested_estimate_items: z.boolean().optional().describe("Include nested estimate items in response"),
      sort: z.string().optional().describe("Field to sort results by"),
      updated_since: z.string().optional().describe("Return only estimates updated since this date (ISO 8601)"),
      page: z.number().optional().describe("Page number for pagination"),
      per_page: z.number().optional().describe("Number of results per page"),
    },
    async (params) => {
      return client.formatResponse(await client.get("/estimates", params as Record<string, unknown>));
    }
  );

  server.tool(
    "freeagent_estimates_get",
    "Get an estimate by ID",
    {
      id: z.string().describe("The ID of the estimate to retrieve"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.get(`/estimates/${id}`));
    }
  );

  server.tool(
    "freeagent_estimates_get_pdf",
    "Get an estimate as a base64-encoded PDF",
    {
      id: z.string().describe("The ID of the estimate to retrieve as PDF"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.get(`/estimates/${id}/pdf`));
    }
  );

  server.tool(
    "freeagent_estimates_create",
    "Create a new estimate",
    {
      data: z.record(z.any()).describe("Estimate attributes such as contact, dated_on, estimate_items, etc."),
    },
    async ({ data }) => {
      return client.formatResponse(await client.post("/estimates", { estimate: data }));
    }
  );

  server.tool(
    "freeagent_estimates_update",
    "Update an existing estimate",
    {
      id: z.string().describe("The ID of the estimate to update"),
      data: z.record(z.any()).describe("Estimate attributes to update"),
    },
    async ({ id, data }) => {
      return client.formatResponse(await client.put(`/estimates/${id}`, { estimate: data }));
    }
  );

  server.tool(
    "freeagent_estimates_delete",
    "Delete an estimate",
    {
      id: z.string().describe("The ID of the estimate to delete"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.del(`/estimates/${id}`));
    }
  );

  server.tool(
    "freeagent_estimate_items_create",
    "Create a new estimate item",
    {
      data: z.record(z.any()).describe("Estimate item attributes such as estimate, description, quantity, price, etc."),
    },
    async ({ data }) => {
      return client.formatResponse(await client.post("/estimate_items", { estimate_item: data }));
    }
  );

  server.tool(
    "freeagent_estimate_items_update",
    "Update an existing estimate item",
    {
      id: z.string().describe("The ID of the estimate item to update"),
      data: z.record(z.any()).describe("Estimate item attributes to update"),
    },
    async ({ id, data }) => {
      return client.formatResponse(await client.put(`/estimate_items/${id}`, { estimate_item: data }));
    }
  );

  server.tool(
    "freeagent_estimate_items_delete",
    "Delete an estimate item",
    {
      id: z.string().describe("The ID of the estimate item to delete"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.del(`/estimate_items/${id}`));
    }
  );

  server.tool(
    "freeagent_estimates_mark_as_sent",
    "Mark an estimate as sent",
    {
      id: z.string().describe("The ID of the estimate to mark as sent"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.put(`/estimates/${id}/transitions/mark_as_sent`));
    }
  );

  server.tool(
    "freeagent_estimates_mark_as_draft",
    "Mark an estimate as draft",
    {
      id: z.string().describe("The ID of the estimate to mark as draft"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.put(`/estimates/${id}/transitions/mark_as_draft`));
    }
  );

  server.tool(
    "freeagent_estimates_mark_as_approved",
    "Mark an estimate as approved",
    {
      id: z.string().describe("The ID of the estimate to mark as approved"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.put(`/estimates/${id}/transitions/mark_as_approved`));
    }
  );

  server.tool(
    "freeagent_estimates_mark_as_rejected",
    "Mark an estimate as rejected",
    {
      id: z.string().describe("The ID of the estimate to mark as rejected"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.put(`/estimates/${id}/transitions/mark_as_rejected`));
    }
  );

  server.tool(
    "freeagent_estimates_convert_to_invoice",
    "Convert an estimate to an invoice",
    {
      id: z.string().describe("The ID of the estimate to convert to an invoice"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.put(`/estimates/${id}/transitions/convert_to_invoice`));
    }
  );

  server.tool(
    "freeagent_estimates_duplicate",
    "Duplicate an estimate",
    {
      id: z.string().describe("The ID of the estimate to duplicate"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.post(`/estimates/${id}/duplicate`));
    }
  );

  server.tool(
    "freeagent_estimates_send_email",
    "Send an estimate by email",
    {
      id: z.string().describe("The ID of the estimate to send"),
      data: z.record(z.any()).describe("Email params: email object with to, subject, body, etc."),
    },
    async ({ id, data }) => {
      return client.formatResponse(await client.post(`/estimates/${id}/send_email`, { estimate: { email: data } }));
    }
  );

  server.tool(
    "freeagent_estimates_default_text_get",
    "Get the default additional text for estimates",
    {},
    async () => {
      return client.formatResponse(await client.get("/estimates/default_additional_text"));
    }
  );

  server.tool(
    "freeagent_estimates_default_text_update",
    "Update the default additional text for estimates",
    {
      data: z.record(z.any()).describe("Default additional text attributes to update"),
    },
    async ({ data }) => {
      return client.formatResponse(await client.put("/estimates/default_additional_text", data));
    }
  );

  server.tool(
    "freeagent_estimates_default_text_delete",
    "Delete the default additional text for estimates",
    {},
    async () => {
      return client.formatResponse(await client.del("/estimates/default_additional_text"));
    }
  );
}
