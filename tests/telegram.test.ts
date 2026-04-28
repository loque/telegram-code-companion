import { describe, expect, it, vi } from "vitest";
import { Bot } from "grammy";

import {
  NotifyTelegramDeliveryError,
  createNotifyTelegramAdapter,
} from "../src/tools/notify/telegram-adapter";

describe("createNotifyTelegramNotifierFromBot", () => {
  it("sends a prefixed message and returns the telegram message id", async () => {
    const bot = new Bot("test-bot-token");
    const sendMessage = vi.spyOn(bot.api, "sendMessage").mockResolvedValue({
      message_id: 42,
      date: 0,
      chat: {
        id: 123,
        type: "private",
        first_name: "Test",
      },
      text: "🔔 Build finished",
    });

    const notifier = createNotifyTelegramAdapter(bot, 123);

    await expect(notifier.notify("Build finished")).resolves.toEqual({
      delivered: true,
      telegram_message_id: 42,
    });

    expect(sendMessage).toHaveBeenCalledWith(123, "🔔 Build finished");
  });

  it("throws a domain-specific error when telegram delivery fails", async () => {
    const bot = new Bot("test-bot-token");
    const sendMessage = vi
      .spyOn(bot.api, "sendMessage")
      .mockRejectedValue(new Error("network down"));

    const notifier = createNotifyTelegramAdapter(bot, 123);

    await expect(notifier.notify("Build finished")).rejects.toBeInstanceOf(
      NotifyTelegramDeliveryError,
    );

    expect(sendMessage).toHaveBeenCalledWith(123, "🔔 Build finished");
  });
});
