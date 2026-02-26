import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { FreeAgentClient } from "../client.js";

export function register(server: McpServer, client: FreeAgentClient): void {
  server.tool(
    "freeagent_company_get",
    "Get company information",
    {},
    async () => {
      return client.formatResponse(await client.get("/company"));
    }
  );

  server.tool(
    "freeagent_company_business_categories",
    "List business categories",
    {},
    async () => {
      return client.formatResponse(await client.get("/company/business_categories"));
    }
  );

  server.tool(
    "freeagent_company_tax_timeline",
    "Get tax timeline",
    {},
    async () => {
      return client.formatResponse(await client.get("/company/tax_timeline"));
    }
  );

  server.tool(
    "freeagent_email_addresses_list",
    "List verified sender email addresses",
    {},
    async () => {
      return client.formatResponse(await client.get("/email_addresses"));
    }
  );
}
