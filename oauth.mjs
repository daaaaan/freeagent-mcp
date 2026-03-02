import { createServer } from "http";
import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";

const CLIENT_ID = "rbSxlb_cb4I4NtS4n1CO1g";
const CLIENT_SECRET = "6fKKq6PNq90n4CZWymdwrA";
const REDIRECT_URI = "http://localhost:3000/callback";
const TOKEN_URL = "https://api.freeagent.com/v2/token_endpoint";
const AUTH_URL = `https://api.freeagent.com/v2/approve_app?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

console.log("\nOpening browser for FreeAgent authorization...\n");
console.log("If the browser doesn't open, visit this URL:\n");
console.log(AUTH_URL + "\n");

try {
  execSync(`xdg-open "${AUTH_URL}" 2>/dev/null || open "${AUTH_URL}" 2>/dev/null`);
} catch {}

const server = createServer(async (req, res) => {
  if (!req.url?.startsWith("/callback")) return;

  const url = new URL(req.url, "http://localhost:3000");
  const code = url.searchParams.get("code");

  if (!code) {
    res.writeHead(400, { "Content-Type": "text/html" });
    res.end("<h1>Error: No authorization code received</h1>");
    server.close();
    return;
  }

  try {
    const response = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Token exchange failed: ${response.status} ${text}`);
    }

    const data = await response.json();

    // Update .env file
    let env = readFileSync(".env", "utf-8");
    env = env.replace(/^FREEAGENT_ACCESS_TOKEN=.*$/m, `FREEAGENT_ACCESS_TOKEN=${data.access_token}`);
    env = env.replace(/^FREEAGENT_REFRESH_TOKEN=.*$/m, `FREEAGENT_REFRESH_TOKEN=${data.refresh_token}`);
    writeFileSync(".env", env);

    console.log("\nTokens saved to .env successfully!");
    console.log(`Access token: ${data.access_token.substring(0, 20)}...`);
    console.log(`Refresh token: ${data.refresh_token.substring(0, 20)}...`);

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Success!</h1><p>Tokens saved. You can close this tab.</p>");
  } catch (err) {
    console.error("\nError:", err.message);
    res.writeHead(500, { "Content-Type": "text/html" });
    res.end(`<h1>Error</h1><p>${err.message}</p>`);
  }

  server.close();
});

server.listen(3000, () => {
  console.log("Waiting for callback on http://localhost:3000/callback ...\n");
});
