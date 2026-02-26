import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { FreeAgentClient } from "../client.js";

export function register(server: McpServer, client: FreeAgentClient): void {
  server.tool(
    "freeagent_projects_list",
    "List projects",
    {
      view: z
        .enum(["active", "completed", "cancelled", "hidden"])
        .optional()
        .describe("Filter projects by status"),
      contact: z
        .string()
        .optional()
        .describe("URI of the contact to filter projects by"),
      sort: z.string().optional().describe("Field to sort results by"),
      page: z.number().optional().describe("Page number for pagination"),
      per_page: z
        .number()
        .optional()
        .describe("Number of results per page"),
    },
    async (params) => {
      return client.formatResponse(
        await client.get("/projects", params as Record<string, unknown>)
      );
    }
  );

  server.tool(
    "freeagent_projects_get",
    "Get a project by ID",
    {
      id: z.string().describe("The ID of the project to retrieve"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.get(`/projects/${id}`));
    }
  );

  server.tool(
    "freeagent_projects_create",
    "Create a new project",
    {
      data: z
        .record(z.any())
        .describe("Project fields to create (e.g. name, contact, status)"),
    },
    async ({ data }) => {
      return client.formatResponse(
        await client.post("/projects", { project: data })
      );
    }
  );

  server.tool(
    "freeagent_projects_update",
    "Update an existing project",
    {
      id: z.string().describe("The ID of the project to update"),
      data: z
        .record(z.any())
        .describe("Project fields to update"),
    },
    async ({ id, data }) => {
      return client.formatResponse(
        await client.put(`/projects/${id}`, { project: data })
      );
    }
  );

  server.tool(
    "freeagent_projects_delete",
    "Delete a project",
    {
      id: z.string().describe("The ID of the project to delete"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.del(`/projects/${id}`));
    }
  );
}
