import { describe, expect, it, vi } from "vitest";

import { createNotifyToolHandler } from "../src/mcp";

describe("createNotifyToolHandler", () => {
  it("delegates to the notifier and returns the notify payload", async () => {
    const notifier = {
      notify: vi.fn().mockResolvedValue({
        delivered: true,
        telegram_message_id: 7,
      }),
    };

    const handleNotify = createNotifyToolHandler(notifier);

    await expect(
      handleNotify({ message: "All checks passed" }),
    ).resolves.toEqual({
      delivered: true,
      telegram_message_id: 7,
    });

    expect(notifier.notify).toHaveBeenCalledWith("All checks passed");
  });
});
