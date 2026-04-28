import type { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ToolAnnotations } from "@modelcontextprotocol/sdk/types.js";
import type { z } from "zod";

type McpToolSchema = z.ZodRawShape;
type McpToolCallback<InputSchema extends McpToolSchema> = {
  callback(
    ...args: Parameters<ToolCallback<InputSchema>>
  ): ReturnType<ToolCallback<InputSchema>>;
}["callback"];

export type McpToolDefinition<
  InputSchema extends McpToolSchema = McpToolSchema,
  OutputSchema extends McpToolSchema = McpToolSchema,
> = {
  name: string;
  config: {
    title?: string;
    description?: string;
    inputSchema: InputSchema;
    outputSchema: OutputSchema;
    annotations?: ToolAnnotations;
    _meta?: Record<string, unknown>;
  };
  handler: McpToolCallback<InputSchema>;
};
