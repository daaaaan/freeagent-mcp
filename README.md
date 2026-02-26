# FreeAgent MCP Server

An MCP (Model Context Protocol) server that exposes the entire FreeAgent accounting API v2 as 188 tools for use with Claude, Cursor, and other MCP-compatible clients.

## Authentication

FreeAgent uses OAuth 2.0. You need to complete a one-time authorization flow to get your tokens, then the server handles refresh automatically.

### Step 1: Create a FreeAgent App

1. Go to [https://dev.freeagent.com](https://dev.freeagent.com) and sign in
2. Click **Create New App**
3. Fill in:
   - **Name**: Whatever you like (e.g. "MCP Server")
   - **OAuth Redirect URI**: `http://localhost:3000/callback` (you'll need this for the token exchange)
4. Note your **OAuth identifier** (client ID) and **OAuth secret** (client secret)

> For testing, use the sandbox at [https://dev.freeagent.com](https://dev.freeagent.com). Sandbox apps get a separate client ID/secret and hit `api.sandbox.freeagent.com` instead of `api.freeagent.com`.

### Step 2: Get Your Authorization Code

Open this URL in a browser (replace the placeholders):

```
https://api.freeagent.com/v2/approve_app?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000/callback
```

For **sandbox**, use:
```
https://api.sandbox.freeagent.com/v2/approve_app?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000/callback
```

Sign in and authorize the app. You'll be redirected to your callback URL with a `?code=XXXXX` parameter. Copy that code -- it expires in 15 minutes.

### Step 3: Exchange the Code for Tokens

```bash
curl -X POST https://api.freeagent.com/v2/token_endpoint \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
  -d "grant_type=authorization_code&code=YOUR_AUTH_CODE&redirect_uri=http://localhost:3000/callback"
```

For **sandbox**, replace `api.freeagent.com` with `api.sandbox.freeagent.com`.

You'll get back:
```json
{
  "access_token": "abc123...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "def456...",
  "refresh_token_expires_in": 7776000
}
```

Save the `access_token` and `refresh_token`.

### Step 4: Configure the MCP Server

Set these environment variables:

```bash
export FREEAGENT_CLIENT_ID="your_oauth_identifier"
export FREEAGENT_CLIENT_SECRET="your_oauth_secret"
export FREEAGENT_ACCESS_TOKEN="abc123..."
export FREEAGENT_REFRESH_TOKEN="def456..."
export FREEAGENT_SANDBOX="true"   # omit or set to "false" for production
```

### Step 5: Add to Your MCP Client

**Claude Desktop** (`~/.claude/claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "freeagent": {
      "command": "node",
      "args": ["/path/to/freeagent-mcp/dist/index.js"],
      "env": {
        "FREEAGENT_CLIENT_ID": "your_client_id",
        "FREEAGENT_CLIENT_SECRET": "your_client_secret",
        "FREEAGENT_ACCESS_TOKEN": "your_access_token",
        "FREEAGENT_REFRESH_TOKEN": "your_refresh_token",
        "FREEAGENT_SANDBOX": "true"
      }
    }
  }
}
```

**Claude Code** (`~/.claude/settings.json`):
```json
{
  "mcpServers": {
    "freeagent": {
      "command": "node",
      "args": ["/path/to/freeagent-mcp/dist/index.js"],
      "env": {
        "FREEAGENT_CLIENT_ID": "your_client_id",
        "FREEAGENT_CLIENT_SECRET": "your_client_secret",
        "FREEAGENT_ACCESS_TOKEN": "your_access_token",
        "FREEAGENT_REFRESH_TOKEN": "your_refresh_token",
        "FREEAGENT_SANDBOX": "true"
      }
    }
  }
}
```

## How Token Refresh Works

You only need to get tokens manually once. After that:

1. The server checks the token expiry before every API call
2. If the access token expires within 5 minutes, it automatically refreshes using your refresh token and client credentials
3. New tokens are saved to `~/.freeagent-mcp/tokens.json` (file permissions `0600`)
4. If environment variables are set, they take priority over the saved token file

Access tokens last **~1 hour**. Refresh tokens last **~90 days**. If your refresh token expires (e.g. the server hasn't run in 3+ months), you'll need to repeat Steps 2-4.

## Token Storage

Tokens are stored in two places (in priority order):

| Source | When Used |
|--------|-----------|
| Environment variables (`FREEAGENT_ACCESS_TOKEN`, `FREEAGENT_REFRESH_TOKEN`) | Always checked first. Set these in your MCP client config. |
| Token file (`~/.freeagent-mcp/tokens.json`) | Fallback. Updated automatically on each token refresh. |

The token file is created with `0600` permissions (owner read/write only) inside a `0700` directory.

## Rate Limits

FreeAgent enforces these limits per user:

| Limit | Threshold |
|-------|-----------|
| Per minute | 120 requests |
| Per hour | 3,600 requests |
| Token refreshes | 15 per minute |

The server handles `429 Too Many Requests` responses automatically -- it reads the `Retry-After` header and waits before retrying (up to 3 attempts).

## Sandbox vs Production

| | Sandbox | Production |
|--|---------|------------|
| API base URL | `api.sandbox.freeagent.com/v2` | `api.freeagent.com/v2` |
| Auth URLs | `api.sandbox.freeagent.com/v2/approve_app` | `api.freeagent.com/v2/approve_app` |
| Environment variable | `FREEAGENT_SANDBOX=true` | `FREEAGENT_SANDBOX=false` (or omit) |
| App credentials | Separate client ID/secret from dev portal | Separate client ID/secret from dev portal |
| Data | Test data, safe to experiment | Real accounting data |

Use sandbox for development and testing. Sandbox and production use **separate** OAuth apps with different credentials.

## Building from Source

```bash
npm install
npm run build
```

## Troubleshooting

**"Not authenticated" error**: Your access token is missing or expired, and no refresh token is available. Re-run the OAuth flow (Steps 2-4).

**"Token refresh failed: 401"**: Your client ID/secret are wrong, or the refresh token has expired (>90 days). Create a new authorization code and exchange it.

**"Rate limit exceeded after 3 retries"**: You're hitting FreeAgent's rate limits hard. Space out your requests or reduce the number of parallel tool calls.

**"FreeAgent API error: ..."**: The API returned an error. The message includes FreeAgent's error details. Check the [FreeAgent API docs](https://dev.freeagent.com/docs) for the specific endpoint.
