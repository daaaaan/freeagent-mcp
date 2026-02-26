import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { FreeAgentClient } from "../client.js";

export function register(server: McpServer, client: FreeAgentClient): void {
  server.tool(
    "freeagent_users_list",
    "List users",
    {
      view: z.enum(["all", "staff", "active_staff", "advisors", "active_advisors"]).optional().describe("Filter users by role/status"),
      page: z.number().optional().describe("Page number for pagination"),
      per_page: z.number().optional().describe("Number of results per page"),
    },
    async (params) => {
      return client.formatResponse(await client.get("/users", params as Record<string, unknown>));
    }
  );

  server.tool(
    "freeagent_users_get",
    "Get a user by ID",
    {
      id: z.string().describe("The ID of the user to retrieve"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.get(`/users/${id}`));
    }
  );

  server.tool(
    "freeagent_users_me",
    "Get the current authenticated user",
    {},
    async () => {
      return client.formatResponse(await client.get("/users/me"));
    }
  );

  server.tool(
    "freeagent_users_create",
    "Create a new user",
    {
      data: z.record(z.any()).describe("User attributes to set on the new user"),
    },
    async ({ data }) => {
      return client.formatResponse(await client.post("/users", { user: data }));
    }
  );

  server.tool(
    "freeagent_users_update",
    "Update an existing user",
    {
      id: z.string().describe("The ID of the user to update"),
      data: z.record(z.any()).describe("User attributes to update"),
    },
    async ({ id, data }) => {
      return client.formatResponse(await client.put(`/users/${id}`, { user: data }));
    }
  );

  server.tool(
    "freeagent_users_delete",
    "Delete a user",
    {
      id: z.string().describe("The ID of the user to delete"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.del(`/users/${id}`));
    }
  );
}
