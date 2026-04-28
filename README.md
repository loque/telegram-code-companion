# Telegram Code Companion (MCP)

This project is a small MCP server that lets your coding agent send you Telegram
messages.

Right now, the implemented tool is:

- `notify`: notify the user when they are AFK

## What you need

- [Node.js](https://nodejs.org/) installed
- A Telegram account
- A Telegram bot token from [@BotFather](https://t.me/BotFather)

## 1) Create your Telegram bot token

1. Open Telegram and message `@BotFather`
2. Run `/newbot`
3. Follow the prompts
4. Copy the bot token

## 2) Find your Telegram chat ID

1. Open a chat with your bot
2. Send any message (for example: `hi`)
3. Run this command (replace `<BOT_TOKEN>`):

```bash
curl "https://api.telegram.org/bot<BOT_TOKEN>/getUpdates"
```

4. In the JSON response, find:

- `result[0].message.chat.id`

That number is your `TELEGRAM_CHAT_ID`.

## 3) Set environment variables

Set these in your shell before starting the server:

```bash
export TELEGRAM_BOT_TOKEN="your_bot_token"
export TELEGRAM_CHAT_ID="your_chat_id"
```

Each coding agent should install this MCP server with its own environment
variables or key material. You can share the same Telegram destination across
clients, or use separate bot tokens and chat IDs per user or per agent.

## 4) Run the built server

```bash
node dist/main.js
```

The server runs over stdio, so you usually start it from your MCP client config.

## 5) Distribution

This MCP server can be installed:

- **Locally**: Point your MCP client to the built `dist/main.js` with environment
  variables set.
- **From a private repo** (in development): Install via `npx` or package
  manager by pointing to a GitHub repo with environment variables passed by your
  MCP client's configuration.

### Environment variables

Environment variables are passed by your MCP client config, not by the server
itself. Examples:

- **GitHub Copilot** (`mcp.json`): `"env": { "TELEGRAM_BOT_TOKEN": "..." }`
- **OpenAI Codex** (CLI): `--env TELEGRAM_BOT_TOKEN=...`
- **Anthropic Claude Code** (config): per-scope environment setup

Consult your MCP client's configuration documentation for how to pass env vars.

## 6) Client integration

The MCP server exports a `notify` tool. Each coding agent (GitHub Copilot, Codex,
Claude Code) can discover this tool and decide when to call it.

The server also exports an `afk` prompt that provides guidance: when to use
`notify` for meaningful milestones and at final completion.

Agents can discover and use this prompt in their instruction systems. For
example, agents might respond to keywords like `afk`, `away`, `notify me`, or
`ping me` by consulting the `afk` prompt for context.

## 7) Use the `notify` tool

Call the tool with:

```json
{
  "message": "Build finished successfully"
}
```

If delivery works, the tool returns:

- `delivered: true`
- `telegram_message_id: <number>`

Recommended usage:

- milestone updates during long-running agentic workflows
- blocked states when the agent needs the user to return
- final completion when the user is AFK

You will receive the message in Telegram with a bell prefix, for example:

`🔔 Build finished successfully`

## Local development

The consumer flow runs the built JavaScript file with Node.js. Local development
uses Bun so you can install dependencies, run the TypeScript source directly,
and rebuild `dist/main.js`.

Install dependencies:

```bash
bun install
```

Run the TypeScript source:

```bash
bun run src/main.ts
```

Build the JavaScript bundle:

```bash
bun run build:js
```

For local development, point your MCP client to:

- Command: `bun`
- Args: `run src/main.ts`
- Env:
  - `TELEGRAM_BOT_TOKEN`
  - `TELEGRAM_CHAT_ID`

Run local checks:

```bash
bun run build:js
bun run format:fix
bun run lint:fix
bun run types:check
bun run test
bunx knip
```
