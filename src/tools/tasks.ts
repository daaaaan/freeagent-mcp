import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { FreeAgentClient } from "../client.js";

export function register(server: McpServer, client: FreeAgentClient): void {
  server.tool(
    "freeagent_tasks_list",
    "List tasks",
    {
      view: z
        .enum(["all", "active", "completed", "hidden"])
        .optional()
        .describe("Filter tasks by status"),
      project: z
        .string()
        .optional()
        .describe("URI of the project to filter tasks by"),
      updated_since: z
        .string()
        .optional()
        .describe("Return tasks updated after this ISO 8601 timestamp"),
      sort: z.string().optional().describe("Field to sort results by"),
      page: z.number().optional().describe("Page number for pagination"),
      per_page: z
        .number()
        .optional()
        .describe("Number of results per page"),
    },
    async (params) => {
      return client.formatResponse(
        await client.get("/tasks", params as Record<string, unknown>)
      );
    }
  );

  server.tool(
    "freeagent_tasks_get",
    "Get a task by ID",
    {
      id: z.string().describe("The ID of the task to retrieve"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.get(`/tasks/${id}`));
    }
  );

  server.tool(
    "freeagent_tasks_create",
    "Create a new task",
    {
      data: z
        .record(z.any())
        .describe(
          "Task fields to create (e.g. name, project URI, billable_rate). Pass 'project' as a query param URI."
        ),
    },
    async ({ data }) => {
      const { project, ...rest } = data as Record<string, unknown>;
      const queryParams = project ? { project: String(project) } : undefined;
      return client.formatResponse(
        await client.post("/tasks", { task: rest }, queryParams)
      );
    }
  );

  server.tool(
    "freeagent_tasks_update",
    "Update an existing task",
    {
      id: z.string().describe("The ID of the task to update"),
      data: z.record(z.any()).describe("Task fields to update"),
    },
    async ({ id, data }) => {
      return client.formatResponse(
        await client.put(`/tasks/${id}`, { task: data })
      );
    }
  );

  server.tool(
    "freeagent_tasks_delete",
    "Delete a task",
    {
      id: z.string().describe("The ID of the task to delete"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.del(`/tasks/${id}`));
    }
  );
}
