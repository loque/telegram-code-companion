import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

import { NotifyDeliveryError } from "./telegram";
import type { Notifier, NotifyToolInput, NotifyToolOutput } from "./types";

export function createNotifyToolHandler(notifier: Notifier) {
  return async (input: NotifyToolInput): Promise<NotifyToolOutput> => {
    // Keep tool orchestration thin; delivery rules live in the notifier domain.
    return notifier.notify(input.message);
  };
}

export function createMcpServer(notifier: Notifier): McpServer {
  const server = new McpServer({
    name: "telegram-human-loop",
    version: "0.1.0",
  });

  const handleNotify = createNotifyToolHandler(notifier);

  server.registerTool(
    "notify",
    {
      description: "Send a one-way message to Telegram.",
      inputSchema: {
        message: z.string().trim().min(1),
      },
      outputSchema: {
        delivered: z.boolean(),
        telegram_message_id: z.number().int().positive(),
      },
    },
    async ({ message }) => {
      try {
        const structuredContent = await handleNotify({ message });

        return {
          content: [
            {
              type: "text" as const,
              text: `Delivered notify message to Telegram (id ${structuredContent.telegram_message_id}).`,
            },
          ],
          structuredContent,
        };
      } catch (error: unknown) {
        // Convert domain failures into MCP-compatible tool errors.
        if (error instanceof NotifyDeliveryError) {
          throw new McpError(ErrorCode.InternalError, error.message);
        }

        if (error instanceof Error) {
          throw new McpError(ErrorCode.InternalError, error.message);
        }

        throw new McpError(
          ErrorCode.InternalError,
          "Unknown notify tool error",
        );
      }
    },
  );

  return server;
}
