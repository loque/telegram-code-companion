import { z } from "zod";

const configSchema = z.object({
  TELEGRAM_BOT_TOKEN: z.string().min(1),
  TELEGRAM_CHAT_ID: z.coerce.number().int(),
});

type AppConfig = {
  telegramBotToken: string;
  telegramChatId: number;
};

export function loadConfig(env: Record<string, string | undefined>): AppConfig {
  // Parse once at startup so runtime paths can trust config invariants.
  const parsedConfig = configSchema.parse(env);

  return {
    telegramBotToken: parsedConfig.TELEGRAM_BOT_TOKEN,
    telegramChatId: parsedConfig.TELEGRAM_CHAT_ID,
  };
}
