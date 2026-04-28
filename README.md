# Telegram Code Companion (MCP)

MCP server that lets your coding agent send Telegram notifications while you are
AFK.

## Requirements

- [Node.js](https://nodejs.org/) 20+
- Telegram bot token from [@BotFather](https://t.me/BotFather)
- Telegram chat ID
- Any MCP client (Claude Code, GitHub Copilot, Codex, OpenCode, etc.)

To get your chat ID, send a message to your bot and run:

```bash
curl "https://api.telegram.org/bot<BOT_TOKEN>/getUpdates"
```

Use `result[0].message.chat.id` as `TELEGRAM_CHAT_ID`.

## Getting started

Set env vars in the shell or MCP client config:

```bash
export TELEGRAM_BOT_TOKEN="your_bot_token"
export TELEGRAM_CHAT_ID="your_chat_id"
```

Standard config works in most tools:

```json
{
  "mcpServers": {
    "telegram-code-companion": {
      "command": "npx",
      "args": ["-y", "telegram-code-companion"]
    }
  }
}
```

## AFK prompt

Use the `afk` prompt (`/afk`, `#afk`, etc., depending on your client). It guides
the agent to send Telegram notifications at meaningful milestones and when the
task is complete.

## Local development

Install dependencies:

```bash
bun install
```

Run:

```bash
bun run dev
```

This starts MCP Inspector with the local server (`src/main.ts`) for interactive
testing.

## Quality checks

```bash
bun run lint:fix
bun run knip:fix
bun run format:fix
bun run types:check
bun run test
```
