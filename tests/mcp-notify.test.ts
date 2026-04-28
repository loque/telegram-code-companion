import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createMcpServer } from "../src/mcp";
import { createNotifyToolDefinition } from "../src/tools/notify/tool-definition";
import type { McpToolDefinition } from "../src/tools/tool-definition";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("createNotifyTool", () => {
  it("delegates to the notifier and returns the notify payload", async () => {
    const notifier = {
      notify: vi.fn().mockResolvedValue({
        delivered: true,
        telegram_message_id: 7,
      }),
    };
    const notifyTool = createNotifyToolDefinition({
      notifyTelegramAdapter: notifier,
    });
    const handlerExtra: Parameters<typeof notifyTool.handler>[1] = {
      signal: new AbortController().signal,
      requestId: "test-request",
      sendNotification: async () => {},
      sendRequest: async () => {
        throw new Error("sendRequest is not implemented in this test");
      },
    };

    await expect(
      notifyTool.handler({ message: "All checks passed" }, handlerExtra),
    ).resolves.toEqual({
      content: [
        {
          type: "text",
          text: "Delivered notify message to Telegram (id 7).",
        },
      ],
      structuredContent: {
        delivered: true,
        telegram_message_id: 7,
      },
    });

    expect(notifier.notify).toHaveBeenCalledWith("All checks passed");
  });

  it("creates the notify tool definition", () => {
    const notifier = {
      notify: vi.fn(),
    };

    const notifyTool = createNotifyToolDefinition({
      notifyTelegramAdapter: notifier,
    });

    expect(notifyTool.name).toBe("notify");
    expect(notifyTool.config.description).toBe(
      "Send a one-way message to Telegram.",
    );
    expect(notifyTool.config.inputSchema).toHaveProperty("message");
    expect(notifyTool.config.outputSchema).toHaveProperty("delivered");
    expect(notifyTool.config.outputSchema).toHaveProperty(
      "telegram_message_id",
    );
  });
});

describe("createMcpServer", () => {
  it("registers the provided tools", () => {
    const tool = {
      name: "example",
      config: {
        description: "Example tool.",
        inputSchema: {},
        outputSchema: {},
      },
      handler: vi.fn(),
    } satisfies McpToolDefinition;
    const registerTool = vi
      .spyOn(McpServer.prototype, "registerTool")
      .mockImplementation(() => ({}) as ReturnType<McpServer["registerTool"]>);

    createMcpServer({ tools: [tool] });

    expect(registerTool).toHaveBeenCalledOnce();
    expect(registerTool).toHaveBeenCalledWith(
      tool.name,
      tool.config,
      tool.handler,
    );
  });
});
