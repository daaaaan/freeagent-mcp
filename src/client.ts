import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { homedir } from "os";

interface TokenData {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface FreeAgentConfig {
  clientId: string;
  clientSecret: string;
  sandbox: boolean;
  accessToken?: string;
  refreshToken?: string;
}

export class FreeAgentClient {
  private config: FreeAgentConfig;
  private tokenData: TokenData | null = null;
  private tokenPath: string;

  constructor(config: FreeAgentConfig) {
    this.config = config;
    const configDir = join(homedir(), ".freeagent-mcp");
    if (!existsSync(configDir)) mkdirSync(configDir, { recursive: true, mode: 0o700 });
    this.tokenPath = join(configDir, "tokens.json");
    this.loadTokens();
  }

  get baseUrl(): string {
    return this.config.sandbox
      ? "https://api.sandbox.freeagent.com/v2"
      : "https://api.freeagent.com/v2";
  }

  private loadTokens(): void {
    if (this.config.accessToken) {
      this.tokenData = {
        access_token: this.config.accessToken,
        refresh_token: this.config.refreshToken || "",
        expires_at: Date.now() + 3600000,
      };
      return;
    }
    if (existsSync(this.tokenPath)) {
      try {
        this.tokenData = JSON.parse(readFileSync(this.tokenPath, "utf-8"));
      } catch {
        this.tokenData = null;
      }
    }
  }

  private saveTokens(): void {
    if (this.tokenData) {
      writeFileSync(this.tokenPath, JSON.stringify(this.tokenData, null, 2), { mode: 0o600 });
    }
  }

  private async refreshAccessToken(): Promise<void> {
    if (!this.tokenData?.refresh_token) {
      throw new Error("No refresh token available");
    }

    const response = await fetch(
      this.config.sandbox
        ? "https://api.sandbox.freeagent.com/v2/token_endpoint"
        : "https://api.freeagent.com/v2/token_endpoint",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(
              `${this.config.clientId}:${this.config.clientSecret}`
            ).toString("base64"),
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: this.tokenData.refresh_token,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as {
      access_token: string;
      refresh_token: string;
      expires_in: number;
    };
    this.tokenData = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: Date.now() + data.expires_in * 1000,
    };
    this.saveTokens();
  }

  private async getAccessToken(): Promise<string> {
    if (!this.tokenData) {
      throw new Error(
        "Not authenticated. Set FREEAGENT_ACCESS_TOKEN and FREEAGENT_REFRESH_TOKEN environment variables."
      );
    }

    // Refresh if expiring within 5 minutes
    if (
      this.tokenData.expires_at - Date.now() < 300000 &&
      this.tokenData.refresh_token &&
      this.config.clientId &&
      this.config.clientSecret
    ) {
      await this.refreshAccessToken();
    }

    return this.tokenData.access_token;
  }

  async request(
    method: string,
    path: string,
    params?: Record<string, unknown>,
    body?: unknown
  ): Promise<unknown> {
    const token = await this.getAccessToken();

    let url = `${this.baseUrl}${path}`;

    if (params && (method === "GET" || method === "DELETE")) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          searchParams.set(key, String(value));
        }
      }
      const qs = searchParams.toString();
      if (qs) url += `?${qs}`;
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "User-Agent": "FreeAgent-MCP/1.0.0",
    };

    if (body) {
      headers["Content-Type"] = "application/json";
    }

    let retries = 0;
    while (retries < 3) {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (response.status === 429) {
        const retryAfter = parseInt(
          response.headers.get("Retry-After") || "5",
          10
        );
        await new Promise((r) => setTimeout(r, retryAfter * 1000));
        retries++;
        continue;
      }

      if (response.status === 204) {
        return { success: true };
      }

      const text = await response.text();
      let responseData: unknown;
      try {
        responseData = JSON.parse(text);
      } catch {
        if (!response.ok) {
          throw new Error(`FreeAgent API error: HTTP ${response.status} - ${text}`);
        }
        return { success: true };
      }

      if (!response.ok) {
        const errObj = responseData as Record<string, unknown>;
        const errorMsg = errObj?.errors
          ? JSON.stringify(errObj.errors)
          : `HTTP ${response.status}`;
        throw new Error(`FreeAgent API error: ${errorMsg}`);
      }

      const totalCount = response.headers.get("X-Total-Count");
      const linkHeader = response.headers.get("Link");

      if (totalCount || linkHeader) {
        return {
          ...(responseData as Record<string, unknown>),
          _pagination: {
            total_count: totalCount ? parseInt(totalCount, 10) : undefined,
            links: linkHeader || undefined,
          },
        };
      }

      return responseData;
    }

    throw new Error("Rate limit exceeded after 3 retries");
  }

  async get(
    path: string,
    params?: Record<string, unknown>
  ): Promise<unknown> {
    return this.request("GET", path, params);
  }

  async post(
    path: string,
    body?: unknown,
    params?: Record<string, unknown>
  ): Promise<unknown> {
    return this.request("POST", path, params, body);
  }

  async put(path: string, body?: unknown): Promise<unknown> {
    return this.request("PUT", path, undefined, body);
  }

  async del(path: string): Promise<unknown> {
    return this.request("DELETE", path);
  }

  formatResponse(data: unknown): {
    content: Array<{ type: "text"; text: string }>;
  } {
    return {
      content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
    };
  }
}
