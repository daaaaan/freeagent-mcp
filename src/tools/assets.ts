import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { FreeAgentClient } from "../client.js";

export function register(server: McpServer, client: FreeAgentClient): void {
  // Capital Assets (read-only)
  server.tool(
    "freeagent_capital_assets_list",
    "List capital assets",
    {
      view: z.enum(["all", "disposed", "disposable"]).optional().describe("Filter assets by status"),
      include_history: z.boolean().optional().describe("Include asset history in response"),
      page: z.number().optional().describe("Page number for pagination"),
      per_page: z.number().optional().describe("Number of results per page"),
    },
    async (params) => {
      return client.formatResponse(await client.get("/capital_assets", params as Record<string, unknown>));
    }
  );

  server.tool(
    "freeagent_capital_assets_get",
    "Get a capital asset by ID",
    {
      id: z.string().describe("The ID of the capital asset to retrieve"),
      include_history: z.boolean().optional().describe("Include asset history in response"),
    },
    async ({ id, include_history }) => {
      const queryParams: Record<string, unknown> = {};
      if (include_history !== undefined) queryParams.include_history = include_history;
      return client.formatResponse(await client.get(`/capital_assets/${id}`, queryParams));
    }
  );

  // Stock Items (read-only)
  server.tool(
    "freeagent_stock_items_list",
    "List stock items",
    {
      sort: z.string().optional().describe("Field to sort results by"),
      page: z.number().optional().describe("Page number for pagination"),
      per_page: z.number().optional().describe("Number of results per page"),
    },
    async (params) => {
      return client.formatResponse(await client.get("/stock_items", params as Record<string, unknown>));
    }
  );

  server.tool(
    "freeagent_stock_items_get",
    "Get a stock item by ID",
    {
      id: z.string().describe("The ID of the stock item to retrieve"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.get(`/stock_items/${id}`));
    }
  );

  // Price List Items
  server.tool(
    "freeagent_price_list_items_list",
    "List price list items",
    {
      sort: z.string().optional().describe("Field to sort results by"),
      page: z.number().optional().describe("Page number for pagination"),
      per_page: z.number().optional().describe("Number of results per page"),
    },
    async (params) => {
      return client.formatResponse(await client.get("/price_list_items", params as Record<string, unknown>));
    }
  );

  server.tool(
    "freeagent_price_list_items_get",
    "Get a price list item by ID",
    {
      id: z.string().describe("The ID of the price list item to retrieve"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.get(`/price_list_items/${id}`));
    }
  );

  server.tool(
    "freeagent_price_list_items_create",
    "Create a new price list item",
    {
      data: z.record(z.any()).describe("Price list item attributes such as description, price, sales_tax_rate, etc."),
    },
    async ({ data }) => {
      return client.formatResponse(await client.post("/price_list_items", { price_list_item: data }));
    }
  );

  server.tool(
    "freeagent_price_list_items_update",
    "Update an existing price list item",
    {
      id: z.string().describe("The ID of the price list item to update"),
      data: z.record(z.any()).describe("Price list item attributes to update"),
    },
    async ({ id, data }) => {
      return client.formatResponse(await client.put(`/price_list_items/${id}`, { price_list_item: data }));
    }
  );

  server.tool(
    "freeagent_price_list_items_delete",
    "Delete a price list item",
    {
      id: z.string().describe("The ID of the price list item to delete"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.del(`/price_list_items/${id}`));
    }
  );

  // Hire Purchases (read-only, UK)
  server.tool(
    "freeagent_hire_purchases_list",
    "List hire purchases (UK only)",
    {
      page: z.number().optional().describe("Page number for pagination"),
      per_page: z.number().optional().describe("Number of results per page"),
    },
    async (params) => {
      return client.formatResponse(await client.get("/hire_purchases", params as Record<string, unknown>));
    }
  );

  server.tool(
    "freeagent_hire_purchases_get",
    "Get a hire purchase by ID (UK only)",
    {
      id: z.string().describe("The ID of the hire purchase to retrieve"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.get(`/hire_purchases/${id}`));
    }
  );

  // Properties (UK Landlord)
  server.tool(
    "freeagent_properties_list",
    "List properties (UK landlord accounts)",
    {
      page: z.number().optional().describe("Page number for pagination"),
      per_page: z.number().optional().describe("Number of results per page"),
    },
    async (params) => {
      return client.formatResponse(await client.get("/properties", params as Record<string, unknown>));
    }
  );

  server.tool(
    "freeagent_properties_get",
    "Get a property by ID (UK landlord accounts)",
    {
      id: z.string().describe("The ID of the property to retrieve"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.get(`/properties/${id}`));
    }
  );

  server.tool(
    "freeagent_properties_create",
    "Create a new property (UK landlord accounts)",
    {
      data: z.record(z.any()).describe("Property attributes such as name, address, acquisition_date, etc."),
    },
    async ({ data }) => {
      return client.formatResponse(await client.post("/properties", { property: data }));
    }
  );

  server.tool(
    "freeagent_properties_update",
    "Update an existing property (UK landlord accounts)",
    {
      id: z.string().describe("The ID of the property to update"),
      data: z.record(z.any()).describe("Property attributes to update"),
    },
    async ({ id, data }) => {
      return client.formatResponse(await client.put(`/properties/${id}`, { property: data }));
    }
  );

  server.tool(
    "freeagent_properties_delete",
    "Delete a property (UK landlord accounts)",
    {
      id: z.string().describe("The ID of the property to delete"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.del(`/properties/${id}`));
    }
  );
}
