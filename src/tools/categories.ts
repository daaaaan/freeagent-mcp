import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { FreeAgentClient } from "../client.js";

export function register(server: McpServer, client: FreeAgentClient): void {
  server.tool(
    "freeagent_categories_list",
    "List chart of accounts categories",
    {
      sub_accounts: z.boolean().optional().describe("Include sub-accounts in response"),
      page: z.number().optional().describe("Page number for pagination"),
      per_page: z.number().optional().describe("Number of results per page"),
    },
    async (params) => {
      return client.formatResponse(await client.get("/categories", params as Record<string, unknown>));
    }
  );

  server.tool(
    "freeagent_categories_get",
    "Get a category by nominal code",
    {
      nominal_code: z.string().describe("The nominal code of the category to retrieve"),
    },
    async ({ nominal_code }) => {
      return client.formatResponse(await client.get(`/categories/${nominal_code}`));
    }
  );

  server.tool(
    "freeagent_categories_create",
    "Create a new category",
    {
      data: z.record(z.any()).describe("Category attributes such as nominal_code, description, category_type, etc."),
    },
    async ({ data }) => {
      return client.formatResponse(await client.post("/categories", { category: data }));
    }
  );

  server.tool(
    "freeagent_categories_update",
    "Update an existing category",
    {
      nominal_code: z.string().describe("The nominal code of the category to update"),
      data: z.record(z.any()).describe("Category attributes to update"),
    },
    async ({ nominal_code, data }) => {
      return client.formatResponse(await client.put(`/categories/${nominal_code}`, { category: data }));
    }
  );

  server.tool(
    "freeagent_categories_delete",
    "Delete a category",
    {
      nominal_code: z.string().describe("The nominal code of the category to delete"),
    },
    async ({ nominal_code }) => {
      return client.formatResponse(await client.del(`/categories/${nominal_code}`));
    }
  );
}
