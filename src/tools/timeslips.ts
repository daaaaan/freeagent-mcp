import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { FreeAgentClient } from "../client.js";

export function register(server: McpServer, client: FreeAgentClient): void {
  server.tool(
    "freeagent_timeslips_list",
    "List timeslips",
    {
      view: z
        .enum(["all", "unbilled", "running"])
        .optional()
        .describe("Filter timeslips by status"),
      user: z
        .string()
        .optional()
        .describe("URI of the user to filter timeslips by"),
      task: z
        .string()
        .optional()
        .describe("URI of the task to filter timeslips by"),
      project: z
        .string()
        .optional()
        .describe("URI of the project to filter timeslips by"),
      from_date: z
        .string()
        .optional()
        .describe("Return timeslips from this date (YYYY-MM-DD)"),
      to_date: z
        .string()
        .optional()
        .describe("Return timeslips up to this date (YYYY-MM-DD)"),
      updated_since: z
        .string()
        .optional()
        .describe("Return timeslips updated after this ISO 8601 timestamp"),
      page: z.number().optional().describe("Page number for pagination"),
      per_page: z
        .number()
        .optional()
        .describe("Number of results per page"),
    },
    async (params) => {
      return client.formatResponse(
        await client.get("/timeslips", params as Record<string, unknown>)
      );
    }
  );

  server.tool(
    "freeagent_timeslips_get",
    "Get a timeslip by ID",
    {
      id: z.string().describe("The ID of the timeslip to retrieve"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.get(`/timeslips/${id}`));
    }
  );

  server.tool(
    "freeagent_timeslips_create",
    "Create a new timeslip",
    {
      data: z.record(z.any()).describe(
        "Timeslip fields to create. Required: user (URI), project (URI), task (URI), dated_on (YYYY-MM-DD), hours (decimal string)."
      ),
    },
    async ({ data }) => {
      return client.formatResponse(
        await client.post("/timeslips", { timeslip: data })
      );
    }
  );

  server.tool(
    "freeagent_timeslips_create_batch",
    "Create multiple timeslips in a single request",
    {
      timeslips: z
        .array(z.record(z.any()))
        .describe(
          "Array of timeslip objects to create. Each should include user, project, task, dated_on, and hours."
        ),
    },
    async ({ timeslips }) => {
      return client.formatResponse(
        await client.post("/timeslips", { timeslips })
      );
    }
  );

  server.tool(
    "freeagent_timeslips_update",
    "Update an existing timeslip",
    {
      id: z.string().describe("The ID of the timeslip to update"),
      data: z.record(z.any()).describe("Timeslip fields to update"),
    },
    async ({ id, data }) => {
      return client.formatResponse(
        await client.put(`/timeslips/${id}`, { timeslip: data })
      );
    }
  );

  server.tool(
    "freeagent_timeslips_delete",
    "Delete a timeslip",
    {
      id: z.string().describe("The ID of the timeslip to delete"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.del(`/timeslips/${id}`));
    }
  );

  server.tool(
    "freeagent_timeslips_timer_start",
    "Start the timer on a timeslip",
    {
      id: z.string().describe("The ID of the timeslip to start the timer on"),
    },
    async ({ id }) => {
      return client.formatResponse(
        await client.post(`/timeslips/${id}/timer`)
      );
    }
  );

  server.tool(
    "freeagent_timeslips_timer_stop",
    "Stop the timer on a timeslip",
    {
      id: z.string().describe("The ID of the timeslip to stop the timer on"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.del(`/timeslips/${id}/timer`));
    }
  );
}
