import { describe, expect, it } from "vitest";

import { formatNotifyMessage } from "../src/notify";

describe("formatNotifyMessage", () => {
  it("adds the notify emoji prefix", () => {
    expect(formatNotifyMessage("Build finished")).toBe("🔔 Build finished");
  });
});
