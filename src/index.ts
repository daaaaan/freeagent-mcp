#!/usr/bin/env node
import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { FreeAgentClient } from "./client.js";
import { register as registerCompany } from "./tools/company.js";
import { register as registerUsers } from "./tools/users.js";
import { register as registerContacts } from "./tools/contacts.js";
import { register as registerProjects } from "./tools/projects.js";
import { register as registerTasks } from "./tools/tasks.js";
import { register as registerTimeslips } from "./tools/timeslips.js";
import { register as registerInvoices } from "./tools/invoices.js";
import { register as registerRecurringInvoices } from "./tools/recurring-invoices.js";
import { register as registerCreditNotes } from "./tools/credit-notes.js";
import { register as registerEstimates } from "./tools/estimates.js";
import { register as registerBills } from "./tools/bills.js";
import { register as registerExpenses } from "./tools/expenses.js";
import { register as registerBankAccounts } from "./tools/bank-accounts.js";
import { register as registerBankTransactions } from "./tools/bank-transactions.js";
import { register as registerCategories } from "./tools/categories.js";
import { register as registerJournalSets } from "./tools/journal-sets.js";
import { register as registerNotes } from "./tools/notes.js";
import { register as registerReports } from "./tools/reports.js";
import { register as registerAssets } from "./tools/assets.js";
import { register as registerPayroll } from "./tools/payroll.js";
import { register as registerTaxReturns } from "./tools/tax-returns.js";

const client = new FreeAgentClient({
  clientId: process.env.FREEAGENT_CLIENT_ID || "",
  clientSecret: process.env.FREEAGENT_CLIENT_SECRET || "",
  sandbox: process.env.FREEAGENT_SANDBOX === "true",
  accessToken: process.env.FREEAGENT_ACCESS_TOKEN,
  refreshToken: process.env.FREEAGENT_REFRESH_TOKEN,
});

const server = new McpServer({
  name: "freeagent-mcp",
  version: "1.0.0",
});

registerCompany(server, client);
registerUsers(server, client);
registerContacts(server, client);
registerProjects(server, client);
registerTasks(server, client);
registerTimeslips(server, client);
registerInvoices(server, client);
registerRecurringInvoices(server, client);
registerCreditNotes(server, client);
registerEstimates(server, client);
registerBills(server, client);
registerExpenses(server, client);
registerBankAccounts(server, client);
registerBankTransactions(server, client);
registerCategories(server, client);
registerJournalSets(server, client);
registerNotes(server, client);
registerReports(server, client);
registerAssets(server, client);
registerPayroll(server, client);
registerTaxReturns(server, client);

const transport = new StdioServerTransport();
await server.connect(transport);
