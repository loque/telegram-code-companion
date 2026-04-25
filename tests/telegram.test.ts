import { describe, expect, it, vi } from "vitest";

import { NotifyDeliveryError, createTelegramNotifier } from "../src/telegram";

describe("createTelegramNotifier", () => {
  it("sends a prefixed message and returns the telegram message id", async () => {
    const sendMessage = vi
      .fn<(chatId: number, text: string) => Promise<{ message_id: number }>>()
      .mockResolvedValue({ message_id: 42 });

    const notifier = createTelegramNotifier({
      allowedChatId: 123,
      sendMessage,
    });

    await expect(notifier.notify("Build finished")).resolves.toEqual({
      delivered: true,
      telegram_message_id: 42,
    });

    expect(sendMessage).toHaveBeenCalledWith(123, "🔔 Build finished");
  });

  it("throws a domain-specific error when telegram delivery fails", async () => {
    const sendMessage = vi
      .fn<(chatId: number, text: string) => Promise<{ message_id: number }>>()
      .mockRejectedValue(new Error("network down"));

    const notifier = createTelegramNotifier({
      allowedChatId: 123,
      sendMessage,
    });

    await expect(notifier.notify("Build finished")).rejects.toBeInstanceOf(
      NotifyDeliveryError,
    );
  });
});
