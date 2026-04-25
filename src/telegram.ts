import type { Bot } from "grammy";

import { formatNotifyMessage } from "./notify";
import type { Notifier, NotifyToolOutput } from "./types";

type SendTelegramMessage = (
  chatId: number,
  text: string,
) => Promise<{ message_id: number }>;

type TelegramNotifierDependencies = {
  allowedChatId: number;
  sendMessage: SendTelegramMessage;
};

export class NotifyDeliveryError extends Error {
  constructor(cause: unknown) {
    super("Failed to deliver notify message to Telegram", { cause });
    this.name = "NotifyDeliveryError";
  }
}

export function createTelegramNotifier(
  dependencies: TelegramNotifierDependencies,
): Notifier {
  const { allowedChatId, sendMessage } = dependencies;

  return {
    async notify(message: string): Promise<NotifyToolOutput> {
      const telegramText = formatNotifyMessage(message);

      try {
        const telegramMessage = await sendMessage(allowedChatId, telegramText);

        return {
          delivered: true,
          telegram_message_id: telegramMessage.message_id,
        };
      } catch (error: unknown) {
        // Keep Telegram transport errors behind one domain error for MCP handlers.
        throw new NotifyDeliveryError(error);
      }
    },
  };
}

export function createTelegramNotifierFromBot(
  bot: Bot,
  allowedChatId: number,
): Notifier {
  // For v1 notify-only scope we only need outbound sendMessage wiring.
  return createTelegramNotifier({
    allowedChatId,
    sendMessage: (chatId, text) => bot.api.sendMessage(chatId, text),
  });
}
