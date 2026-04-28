import { describe, expect, it } from "vitest";

import { formatNotifyMessage } from "../src/tools/notify/telegram-adapter";

describe("formatNotifyMessage", () => {
  it("adds the notify emoji prefix", () => {
    expect(formatNotifyMessage("Build finished")).toBe("🔔 Build finished");
  });
});
