import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Bot } from "grammy";

import { loadConfig } from "./config";
import { createMcpServer } from "./mcp";
import { createNotifyToolDefinition } from "./tools/notify/tool-definition";
import { createNotifyTelegramAdapter } from "./tools/notify/telegram-adapter";

export async function startServer(): Promise<void> {
  // Bootstrap order is explicit to keep startup behavior easy to reason about.
  const config = loadConfig(process.env);
  const telegramBot = new Bot(config.telegramBotToken);

  const notifyTelegramAdapter = createNotifyTelegramAdapter(
    telegramBot,
    config.telegramAllowedChatId,
  );
  const notifyTool = createNotifyToolDefinition({
    notifyTelegramAdapter,
  });

  const mcpServer = createMcpServer({ tools: [notifyTool] });
  const transport = new StdioServerTransport();

  await mcpServer.connect(transport);
}

startServer().catch((error: unknown) => {
  const errorMessage =
    error instanceof Error ? (error.stack ?? error.message) : String(error);

  console.error(errorMessage);
  process.exit(1);
});
