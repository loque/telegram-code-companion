import type { Bot } from "grammy";

const NOTIFY_EMOJI_PREFIX = "🔔";

export function formatNotifyMessage(message: string): string {
  return `${NOTIFY_EMOJI_PREFIX} ${message.trim()}`;
}

export class NotifyTelegramDeliveryError extends Error {
  constructor(cause: unknown) {
    super("Failed to deliver notify message to Telegram", { cause });
    this.name = "NotifyTelegramDeliveryError";
  }
}

type NotifyToolOutput = {
  delivered: boolean;
  telegram_message_id: number;
};

export type NotifyTelegramAdapter = {
  notify(message: string): Promise<NotifyToolOutput>;
};

export function createNotifyTelegramAdapter(
  bot: Bot,
  allowedChatId: number,
): NotifyTelegramAdapter {
  return {
    async notify(message: string): Promise<NotifyToolOutput> {
      const telegramText = formatNotifyMessage(message);

      try {
        const telegramMessage = await bot.api.sendMessage(
          allowedChatId,
          telegramText,
        );

        return {
          delivered: true,
          telegram_message_id: telegramMessage.message_id,
        };
      } catch (error: unknown) {
        throw new NotifyTelegramDeliveryError(error);
      }
    },
  };
}
