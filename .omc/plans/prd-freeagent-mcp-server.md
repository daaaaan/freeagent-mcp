# PRD: FreeAgent MCP Server

**Status:** Draft
**Created:** 2026-02-26
**Slug:** freeagent-mcp-server

---

## Problem Statement

FreeAgent is a comprehensive cloud accounting platform with a rich REST API covering 40+ resource types. Currently, AI assistants have no structured way to interact with FreeAgent data — querying invoices, managing contacts, tracking expenses, or pulling financial reports requires manual API calls or custom integrations. An MCP (Model Context Protocol) server would expose the full FreeAgent API as tools that any MCP-compatible AI client can use natively.

## Goals

1. Build a fully functional MCP server that exposes **all** FreeAgent API v2 endpoints as MCP tools
2. Implement OAuth 2.0 authentication with automatic token refresh
3. Support both sandbox and production FreeAgent environments
4. Provide comprehensive coverage of all 40+ API resource categories
5. Handle pagination, rate limiting, and error responses gracefully
6. Ship as an installable npm package that users can configure and run

## Non-Goals

- Building a web UI or dashboard
- Implementing webhook receivers for FreeAgent events
- Supporting XML format (JSON only for MCP)
- Implementing business logic beyond what the API provides (e.g., no custom report generation)
- Multi-tenant support (single FreeAgent account per server instance)

## Technical Constraints

- **Runtime:** Node.js with TypeScript
- **MCP SDK:** `@modelcontextprotocol/sdk` (latest)
- **Transport:** stdio (standard for MCP servers)
- **Auth:** OAuth 2.0 with token persistence and auto-refresh
- **API Base URLs:**
  - Production: `https://api.freeagent.com/v2/`
  - Sandbox: `https://api.sandbox.freeagent.com/v2/`
- **API Conventions:**
  - JSON request/response (`Accept: application/json`, `Content-Type: application/json`)
  - Bearer token auth (`Authorization: Bearer TOKEN`)
  - Pagination: `page` & `per_page` params (default 25, max 100), `Link` header, `X-Total-Count` header
  - Rate limits: 120 req/min, 3,600 req/hour, 15 token refreshes/min
  - User-Agent header required
  - HTTP verbs: GET, POST, PUT, DELETE

---

## API Resource Coverage

### Phase 1: Core Infrastructure & Auth

#### 1.1 Project Scaffolding
- TypeScript project with `tsconfig.json`
- MCP SDK integration with stdio transport
- Build system (compile TS to JS)
- Package.json with bin entry for CLI execution

#### 1.2 OAuth 2.0 Authentication
- Authorization URL: `https://api.freeagent.com/v2/approve_app`
- Token endpoint: `https://api.freeagent.com/v2/token_endpoint`
- Authorization code exchange flow
- Automatic token refresh (tokens expire in ~1 hour)
- Token persistence to disk (encrypted/secured)
- Support for `client_id`, `client_secret`, `redirect_uri`
- Sandbox vs production environment switching

#### 1.3 HTTP Client Foundation
- Base HTTP client with auth header injection
- Automatic pagination support (follow `Link` headers)
- Rate limit handling (respect 429 + `Retry-After`)
- Error response parsing and MCP-friendly error formatting
- Request/response logging (debug mode)

### Phase 2: Company, Users & Contacts

#### 2.1 Company (read-only)
- `GET /v2/company` — Get company info
- `GET /v2/company/business_categories` — List business categories
- `GET /v2/company/tax_timeline` — Get tax timeline

#### 2.2 Users
- `GET /v2/users` — List users (views: all, staff, active_staff, advisors, active_advisors)
- `GET /v2/users/:id` — Get user
- `GET /v2/users/me` — Get current user
- `POST /v2/users` — Create user
- `PUT /v2/users/:id` — Update user
- `DELETE /v2/users/:id` — Delete user

#### 2.3 Contacts
- `GET /v2/contacts` — List contacts (views: all, active, clients, suppliers, active_projects, completed_projects, open_clients, open_suppliers, hidden)
- `GET /v2/contacts/:id` — Get contact
- `POST /v2/contacts` — Create contact
- `PUT /v2/contacts/:id` — Update contact
- `DELETE /v2/contacts/:id` — Delete contact

#### 2.4 Email Addresses
- `GET /v2/email_addresses` — List verified sender emails

### Phase 3: Projects, Tasks & Time Tracking

#### 3.1 Projects
- `GET /v2/projects` — List projects (views: active, completed, cancelled, hidden; filter by contact)
- `GET /v2/projects/:id` — Get project
- `POST /v2/projects` — Create project
- `PUT /v2/projects/:id` — Update project
- `DELETE /v2/projects/:id` — Delete project

#### 3.2 Tasks
- `GET /v2/tasks` — List tasks (views: all, active, completed, hidden; filter by project)
- `GET /v2/tasks/:id` — Get task
- `POST /v2/tasks` — Create task
- `PUT /v2/tasks/:id` — Update task
- `DELETE /v2/tasks/:id` — Delete task

#### 3.3 Timeslips
- `GET /v2/timeslips` — List timeslips (views: all, unbilled, running; filter by user/task/project + date range)
- `GET /v2/timeslips/:id` — Get timeslip
- `POST /v2/timeslips` — Create timeslip (supports batch)
- `PUT /v2/timeslips/:id` — Update timeslip
- `DELETE /v2/timeslips/:id` — Delete timeslip
- `POST /v2/timeslips/:id/timer` — Start timer
- `DELETE /v2/timeslips/:id/timer` — Stop timer

### Phase 4: Invoicing & Estimates

#### 4.1 Invoices
- `GET /v2/invoices` — List invoices (views: all, recent_open_or_overdue, open, overdue, draft, paid, scheduled_to_email; filter by contact/project)
- `GET /v2/invoices/:id` — Get invoice
- `GET /v2/invoices/:id/pdf` — Get invoice PDF (base64)
- `POST /v2/invoices` — Create invoice
- `PUT /v2/invoices/:id` — Update invoice
- `DELETE /v2/invoices/:id` — Delete invoice
- `PUT /v2/invoices/:id/transitions/mark_as_sent` — Mark as sent
- `PUT /v2/invoices/:id/transitions/mark_as_scheduled` — Mark as scheduled
- `PUT /v2/invoices/:id/transitions/mark_as_draft` — Mark as draft
- `PUT /v2/invoices/:id/transitions/mark_as_cancelled` — Cancel invoice
- `PUT /v2/invoices/:id/transitions/convert_to_credit_note` — Convert to credit note
- `POST /v2/invoices/:id/duplicate` — Duplicate invoice
- `POST /v2/invoices/:id/send_email` — Email invoice
- `GET /v2/invoices/timeline` — Invoice timeline
- `GET /v2/invoices/default_additional_text` — Get default text
- `PUT /v2/invoices/default_additional_text` — Update default text
- `DELETE /v2/invoices/default_additional_text` — Delete default text

#### 4.2 Recurring Invoices (read-only)
- `GET /v2/recurring_invoices` — List recurring invoices (views: draft, active, inactive; filter by contact)
- `GET /v2/recurring_invoices/:id` — Get recurring invoice

#### 4.3 Credit Notes
- `GET /v2/credit_notes` — List credit notes (views: all, recent_open_or_overdue, open, overdue, draft, refunded; filter by contact/project)
- `GET /v2/credit_notes/:id` — Get credit note
- `GET /v2/credit_notes/:id/pdf` — Get credit note PDF
- `POST /v2/credit_notes` — Create credit note
- `PUT /v2/credit_notes/:id` — Update credit note
- `DELETE /v2/credit_notes/:id` — Delete credit note
- `POST /v2/credit_notes/:id/send_email` — Email credit note
- `PUT /v2/credit_notes/:id/transitions/mark_as_sent` — Mark as sent
- `PUT /v2/credit_notes/:id/transitions/mark_as_draft` — Mark as draft

#### 4.4 Credit Note Reconciliations
- `GET /v2/credit_note_reconciliations` — List reconciliations
- `GET /v2/credit_note_reconciliations/:id` — Get reconciliation
- `POST /v2/credit_note_reconciliations` — Create reconciliation
- `PUT /v2/credit_note_reconciliations/:id` — Update reconciliation
- `DELETE /v2/credit_note_reconciliations/:id` — Delete reconciliation

#### 4.5 Estimates
- `GET /v2/estimates` — List estimates (filter by contact/project/invoice)
- `GET /v2/estimates/:id` — Get estimate
- `GET /v2/estimates/:id/pdf` — Get estimate PDF
- `POST /v2/estimates` — Create estimate
- `PUT /v2/estimates/:id` — Update estimate
- `DELETE /v2/estimates/:id` — Delete estimate
- `POST /v2/estimate_items` — Create estimate item
- `PUT /v2/estimate_items/:id` — Update estimate item
- `DELETE /v2/estimate_items/:id` — Delete estimate item
- `PUT /v2/estimates/:id/transitions/mark_as_sent` — Mark as sent
- `PUT /v2/estimates/:id/transitions/mark_as_draft` — Mark as draft
- `PUT /v2/estimates/:id/transitions/mark_as_approved` — Mark as approved
- `PUT /v2/estimates/:id/transitions/mark_as_rejected` — Mark as rejected
- `PUT /v2/estimates/:id/transitions/convert_to_invoice` — Convert to invoice
- `POST /v2/estimates/:id/duplicate` — Duplicate estimate
- `POST /v2/estimates/:id/send_email` — Email estimate
- `GET /v2/estimates/default_additional_text` — Get default text
- `PUT /v2/estimates/default_additional_text` — Update default text
- `DELETE /v2/estimates/default_additional_text` — Delete default text

### Phase 5: Bills & Expenses

#### 5.1 Bills
- `GET /v2/bills` — List bills (filter by contact/project + date range)
- `GET /v2/bills/:id` — Get bill
- `POST /v2/bills` — Create bill
- `PUT /v2/bills/:id` — Update bill
- `DELETE /v2/bills/:id` — Delete bill

#### 5.2 Expenses
- `GET /v2/expenses` — List expenses (views: recent, recurring; filter by project + date range)
- `GET /v2/expenses/:id` — Get expense
- `POST /v2/expenses` — Create expense (supports batch)
- `PUT /v2/expenses/:id` — Update expense
- `DELETE /v2/expenses/:id` — Delete expense
- `GET /v2/expenses/mileage_settings` — Get mileage settings

### Phase 6: Banking

#### 6.1 Bank Accounts
- `GET /v2/bank_accounts` — List bank accounts (views: standard_bank_accounts, credit_card_accounts, paypal_accounts)
- `GET /v2/bank_accounts/:id` — Get bank account
- `POST /v2/bank_accounts` — Create bank account
- `PUT /v2/bank_accounts/:id` — Update bank account
- `DELETE /v2/bank_accounts/:id` — Delete bank account

#### 6.2 Bank Transactions
- `GET /v2/bank_transactions` — List transactions (requires bank_account; views: all, unexplained, explained, manual, imported, marked_for_review)
- `GET /v2/bank_transactions/:id` — Get transaction
- `DELETE /v2/bank_transactions/:id` — Delete transaction
- `POST /v2/bank_transactions/statement` — Upload bank statement (JSON array or file)

#### 6.3 Bank Transaction Explanations
- `GET /v2/bank_transaction_explanations` — List explanations (requires bank_account)
- `GET /v2/bank_transaction_explanations/:id` — Get explanation
- `POST /v2/bank_transaction_explanations` — Create explanation
- `PUT /v2/bank_transaction_explanations/:id` — Update explanation
- `DELETE /v2/bank_transaction_explanations/:id` — Delete explanation

#### 6.4 Bank Feeds (read-only)
- `GET /v2/bank_feeds` — List bank feeds
- `GET /v2/bank_feeds/:id` — Get bank feed

### Phase 7: Accounting & Categories

#### 7.1 Categories
- `GET /v2/categories` — List categories (supports sub_accounts param)
- `GET /v2/categories/:nominal_code` — Get category
- `POST /v2/categories` — Create category
- `PUT /v2/categories/:nominal_code` — Update category
- `DELETE /v2/categories/:nominal_code` — Delete category

#### 7.2 Journal Sets
- `GET /v2/journal_sets` — List journal sets (filter by date range + tag)
- `GET /v2/journal_sets/:id` — Get journal set
- `GET /v2/journal_sets/opening_balances` — Get opening balances
- `POST /v2/journal_sets` — Create journal set
- `PUT /v2/journal_sets/:id` — Update journal set
- `DELETE /v2/journal_sets/:id` — Delete journal set

#### 7.3 Accounting Transactions
- `GET /v2/accounting/transactions` — List transactions (filter by date range + nominal_code)
- `GET /v2/accounting/transactions/:id` — Get transaction

#### 7.4 Notes
- `GET /v2/notes` — List notes (filter by contact or project)
- `GET /v2/notes/:id` — Get note
- `POST /v2/notes` — Create note (on contact or project)
- `PUT /v2/notes/:id` — Update note
- `DELETE /v2/notes/:id` — Delete note

#### 7.5 Attachments
- `GET /v2/attachments/:id` — Get attachment
- `DELETE /v2/attachments/:id` — Delete attachment

### Phase 8: Financial Reports

#### 8.1 Profit & Loss
- `GET /v2/accounting/profit_and_loss/summary` — P&L summary (filter by date range or accounting period)

#### 8.2 Balance Sheet
- `GET /v2/accounting/balance_sheet` — Balance sheet (optional as_at_date)
- `GET /v2/accounting/balance_sheet/opening_balances` — Opening balances

#### 8.3 Trial Balance
- `GET /v2/accounting/trial_balance/summary` — Trial balance (optional date range)
- `GET /v2/accounting/trial_balance/summary/opening_balances` — Opening balances

#### 8.4 Cashflow
- `GET /v2/cashflow` — Cashflow summary (requires from_date, to_date)

### Phase 9: Assets, Inventory & Payroll

#### 9.1 Capital Assets (read-only)
- `GET /v2/capital_assets` — List capital assets (views: all, disposed, disposable; optional include_history)
- `GET /v2/capital_assets/:id` — Get capital asset

#### 9.2 Stock Items (read-only)
- `GET /v2/stock_items` — List stock items
- `GET /v2/stock_items/:id` — Get stock item

#### 9.3 Price List Items
- `GET /v2/price_list_items` — List price list items
- `GET /v2/price_list_items/:id` — Get price list item
- `POST /v2/price_list_items` — Create price list item
- `PUT /v2/price_list_items/:id` — Update price list item
- `DELETE /v2/price_list_items/:id` — Delete price list item

#### 9.4 Hire Purchases (read-only, UK only)
- `GET /v2/hire_purchases` — List hire purchases
- `GET /v2/hire_purchases/:id` — Get hire purchase

#### 9.5 Properties (UK Landlord only)
- `GET /v2/properties` — List properties
- `GET /v2/properties/:id` — Get property
- `POST /v2/properties` — Create property
- `PUT /v2/properties/:id` — Update property
- `DELETE /v2/properties/:id` — Delete property

#### 9.6 Payroll (read-only, UK only)
- `GET /v2/payroll/:year` — List payroll periods
- `GET /v2/payroll/:year/:period` — List payslips for period
- `PUT /v2/payroll/:year/payments/:payment_date/mark_as_paid` — Mark payment as paid
- `GET /v2/payroll/:year/payments/:payment_date/mark_as_unpaid` — Mark payment as unpaid

#### 9.7 Payroll Profiles (read-only, UK only)
- `GET /v2/payroll_profiles/:year` — List payroll profiles (optional user filter)

#### 9.8 CIS Bands (read-only, UK only)
- `GET /v2/cis_bands` — List CIS bands

### Phase 10: Tax Returns

#### 10.1 VAT Returns (UK)
- `GET /v2/vat_returns` — List VAT returns
- `GET /v2/vat_returns/:period_ends_on` — Get VAT return
- `PUT /v2/vat_returns/:period_ends_on/mark_as_filed` — Mark as filed
- `PUT /v2/vat_returns/:period_ends_on/mark_as_unfiled` — Mark as unfiled
- `PUT /v2/vat_returns/:period_ends_on/payments/:payment_date/mark_as_paid` — Mark payment as paid
- `PUT /v2/vat_returns/:period_ends_on/payments/:payment_date/mark_as_unpaid` — Mark payment as unpaid

#### 10.2 Corporation Tax Returns (UK)
- `GET /v2/corporation_tax_returns` — List returns
- `GET /v2/corporation_tax_returns/:period_ends_on` — Get return
- `PUT /v2/corporation_tax_returns/:period_ends_on/mark_as_filed` — Mark as filed
- `PUT /v2/corporation_tax_returns/:period_ends_on/mark_as_unfiled` — Mark as unfiled
- `PUT /v2/corporation_tax_returns/:period_ends_on/mark_as_paid` — Mark as paid
- `PUT /v2/corporation_tax_returns/:period_ends_on/mark_as_unpaid` — Mark as unpaid

#### 10.3 Income Tax / Self Assessment Returns (UK)
- `GET /v2/users/:user_id/self_assessment_returns` — List returns for user
- `GET /v2/users/:user_id/self_assessment_returns/:period_ends_on` — Get return
- `PUT .../mark_as_filed` — Mark as filed
- `PUT .../mark_as_unfiled` — Mark as unfiled
- `PUT .../payments/:payment_date/mark_as_paid` — Mark payment as paid
- `PUT .../payments/:payment_date/mark_as_unpaid` — Mark payment as unpaid

#### 10.4 Sales Tax Periods (US/Universal only)
- `GET /v2/sales_tax_periods` — List periods
- `GET /v2/sales_tax_periods/:id` — Get period
- `POST /v2/sales_tax_periods` — Create period
- `PUT /v2/sales_tax_periods/:id` — Update period
- `DELETE /v2/sales_tax_periods/:id` — Delete period

#### 10.5 Final Accounts Reports
- `GET /v2/final_accounts_reports` — List reports
- `GET /v2/final_accounts_reports/:period_ends_on` — Get report
- `PUT /v2/final_accounts_reports/:period_ends_on/mark_as_filed` — Mark as filed
- `PUT /v2/final_accounts_reports/:period_ends_on/mark_as_unfiled` — Mark as unfiled

---

## MCP Tool Design Principles

1. **Naming convention:** `freeagent_<resource>_<action>` (e.g., `freeagent_invoices_list`, `freeagent_invoices_create`)
2. **Tool descriptions:** Clear, concise descriptions matching the FreeAgent API docs
3. **Input schemas:** Zod schemas matching FreeAgent API parameters with proper types and optionality
4. **Pagination:** List tools accept optional `page` and `per_page` params, return results with pagination metadata
5. **Error handling:** Return structured error messages with FreeAgent error codes
6. **Grouping:** Related operations grouped logically (e.g., all invoice transitions as separate tools)

## MCP Resources (Optional Enhancement)

Consider exposing key read-only data as MCP resources:
- `freeagent://company` — Company info
- `freeagent://users/me` — Current user profile

---

## Acceptance Criteria

### Infrastructure
- [ ] Project builds and runs with `npx freeagent-mcp` or similar
- [ ] OAuth 2.0 flow works: user can authorize and tokens are persisted
- [ ] Tokens auto-refresh before expiry without user intervention
- [ ] Sandbox and production environments selectable via config
- [ ] Rate limit 429 responses handled with exponential backoff
- [ ] Pagination works correctly, returning all results when requested

### Tool Coverage
- [ ] All Phase 2 tools implemented and tested (Company, Users, Contacts, Email Addresses)
- [ ] All Phase 3 tools implemented and tested (Projects, Tasks, Timeslips + timers)
- [ ] All Phase 4 tools implemented and tested (Invoices + transitions + email + PDF, Recurring Invoices, Credit Notes, Credit Note Reconciliations, Estimates + items + transitions)
- [ ] All Phase 5 tools implemented and tested (Bills, Expenses + mileage settings)
- [ ] All Phase 6 tools implemented and tested (Bank Accounts, Bank Transactions + statement upload, Bank Transaction Explanations, Bank Feeds)
- [ ] All Phase 7 tools implemented and tested (Categories, Journal Sets, Accounting Transactions, Notes, Attachments)
- [ ] All Phase 8 tools implemented and tested (P&L, Balance Sheet, Trial Balance, Cashflow)
- [ ] All Phase 9 tools implemented and tested (Capital Assets, Stock Items, Price List Items, Hire Purchases, Properties, Payroll, Payroll Profiles, CIS Bands)
- [ ] All Phase 10 tools implemented and tested (VAT Returns, Corporation Tax Returns, Self Assessment Returns, Sales Tax Periods, Final Accounts Reports)

### Quality
- [ ] TypeScript strict mode passes with no errors
- [ ] All tools have proper Zod input validation schemas
- [ ] Error responses from FreeAgent API are handled gracefully and returned as readable MCP errors
- [ ] README with setup instructions, configuration guide, and tool reference

### Total Tool Count Target
Approximately **150+ MCP tools** covering all FreeAgent API v2 endpoints.

---

## Implementation Phases Summary

| Phase | Focus | Est. Tools |
|-------|-------|-----------|
| 1 | Infrastructure, Auth, HTTP Client | 0 (foundation) |
| 2 | Company, Users, Contacts | ~15 |
| 3 | Projects, Tasks, Timeslips | ~17 |
| 4 | Invoices, Credit Notes, Estimates | ~45 |
| 5 | Bills, Expenses | ~12 |
| 6 | Banking | ~16 |
| 7 | Accounting & Categories | ~15 |
| 8 | Financial Reports | ~5 |
| 9 | Assets, Inventory, Payroll | ~15 |
| 10 | Tax Returns | ~20 |
| **Total** | | **~160** |

---

## Configuration

The server will be configured via environment variables or a config file:

```json
{
  "freeagent": {
    "clientId": "YOUR_CLIENT_ID",
    "clientSecret": "YOUR_CLIENT_SECRET",
    "sandbox": false
  }
}
```

Or environment variables:
```
FREEAGENT_CLIENT_ID=...
FREEAGENT_CLIENT_SECRET=...
FREEAGENT_SANDBOX=true
FREEAGENT_ACCESS_TOKEN=...
FREEAGENT_REFRESH_TOKEN=...
```
