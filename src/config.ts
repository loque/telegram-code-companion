import { z } from "zod";

const configSchema = z.object({
  TELEGRAM_BOT_TOKEN: z.string().min(1),
  TELEGRAM_ALLOWED_CHAT_ID: z.coerce.number().int(),
});

type AppConfig = {
  telegramBotToken: string;
  telegramAllowedChatId: number;
};

export function loadConfig(env: Record<string, string | undefined>): AppConfig {
  // Parse once at startup so runtime paths can trust config invariants.
  const parsedConfig = configSchema.parse(env);

  return {
    telegramBotToken: parsedConfig.TELEGRAM_BOT_TOKEN,
    telegramAllowedChatId: parsedConfig.TELEGRAM_ALLOWED_CHAT_ID,
  };
}
