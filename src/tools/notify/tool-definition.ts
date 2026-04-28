import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

import type { McpToolDefinition } from "../tool-definition";
import type { NotifyTelegramAdapter } from "./telegram-adapter";

const notifyToolInputSchema = {
  message: z.string().trim().min(1),
};

const notifyToolOutputSchema = {
  delivered: z.boolean(),
  telegram_message_id: z.number().int().positive(),
};

type NotifyToolDependencies = {
  notifyTelegramAdapter: NotifyTelegramAdapter;
};

// Build the MCP "notify" tool that forwards a single message to Telegram and
// normalizes transport errors into MCP-compatible failures.
export function createNotifyToolDefinition({
  notifyTelegramAdapter,
}: NotifyToolDependencies): McpToolDefinition<
  typeof notifyToolInputSchema,
  typeof notifyToolOutputSchema
> {
  return {
    name: "notify",
    config: {
      description: "Notify the user on Telegram when they are AFK.",
      inputSchema: notifyToolInputSchema,
      outputSchema: notifyToolOutputSchema,
    },
    async handler({ message }) {
      try {
        const structuredContent = await notifyTelegramAdapter.notify(message);

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
        if (error instanceof Error) {
          throw new McpError(ErrorCode.InternalError, error.message);
        }

        throw new McpError(
          ErrorCode.InternalError,
          "Unknown notify tool error",
        );
      }
    },
  };
}
