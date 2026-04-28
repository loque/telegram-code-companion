import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import type { McpToolDefinition } from "./tools/tool-definition";
import { name, version } from "../package.json";
import { readFile } from "./utils";

type CreateMcpServerOptions = {
  tools: McpToolDefinition[];
};

export function createMcpServer({ tools }: CreateMcpServerOptions): McpServer {
  const server = new McpServer({
    name,
    version,
  });

  for (const tool of tools) {
    server.registerTool(tool.name, tool.config, tool.handler);
  }

  // Register the afk prompt
  server.registerPrompt(
    "afk",
    {
      description:
        "Guidance for using the tools when the user is away from keyboard (AFK).",
    },
    async () => {
      const promptText = readFile("afk-prompt.md");
      return {
        messages: [
          {
            role: "user" as const,
            content: {
              type: "text" as const,
              text: promptText || "Prompt content not found",
            },
          },
        ],
      };
    },
  );

  return server;
}
