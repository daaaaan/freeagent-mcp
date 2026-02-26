import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { FreeAgentClient } from "../client.js";

export function register(server: McpServer, client: FreeAgentClient): void {
  server.tool(
    "freeagent_notes_list",
    "List notes. Must pass either contact or project to filter results.",
    {
      contact: z.string().optional().describe("Filter by contact URI (must pass contact or project)"),
      project: z.string().optional().describe("Filter by project URI (must pass contact or project)"),
      page: z.number().optional().describe("Page number for pagination"),
      per_page: z.number().optional().describe("Number of results per page"),
    },
    async (params) => {
      return client.formatResponse(await client.get("/notes", params as Record<string, unknown>));
    }
  );

  server.tool(
    "freeagent_notes_get",
    "Get a note by ID",
    {
      id: z.string().describe("The ID of the note to retrieve"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.get(`/notes/${id}`));
    }
  );

  server.tool(
    "freeagent_notes_create",
    "Create a new note",
    {
      contact: z.string().optional().describe("Contact URI to associate the note with"),
      project: z.string().optional().describe("Project URI to associate the note with"),
      data: z.record(z.any()).describe("Note attributes such as note_type, content, etc."),
    },
    async ({ contact, project, data }) => {
      const queryParams: Record<string, unknown> = {};
      if (contact) queryParams.contact = contact;
      if (project) queryParams.project = project;
      return client.formatResponse(await client.post("/notes", { note: data }, queryParams));
    }
  );

  server.tool(
    "freeagent_notes_update",
    "Update an existing note",
    {
      id: z.string().describe("The ID of the note to update"),
      data: z.record(z.any()).describe("Note attributes to update"),
    },
    async ({ id, data }) => {
      return client.formatResponse(await client.put(`/notes/${id}`, { note: data }));
    }
  );

  server.tool(
    "freeagent_notes_delete",
    "Delete a note",
    {
      id: z.string().describe("The ID of the note to delete"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.del(`/notes/${id}`));
    }
  );

  server.tool(
    "freeagent_attachments_get",
    "Get an attachment by ID",
    {
      id: z.string().describe("The ID of the attachment to retrieve"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.get(`/attachments/${id}`));
    }
  );

  server.tool(
    "freeagent_attachments_delete",
    "Delete an attachment",
    {
      id: z.string().describe("The ID of the attachment to delete"),
    },
    async ({ id }) => {
      return client.formatResponse(await client.del(`/attachments/${id}`));
    }
  );
}
