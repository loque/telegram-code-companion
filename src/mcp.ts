import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import type { McpToolDefinition } from "./tools/tool-definition";
import { name, version } from "../package.json";

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

  return server;
}
