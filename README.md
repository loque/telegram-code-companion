# Telegram Code Companion (MCP)

This project is a small MCP server that lets your coding agent send you Telegram messages.

Right now, the implemented tool is:

- `notify`: send a one-way status message to Telegram

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

That number is your `TELEGRAM_ALLOWED_CHAT_ID`.

## 3) Set environment variables

Set these in your shell before starting the server:

```bash
export TELEGRAM_BOT_TOKEN="your_bot_token"
export TELEGRAM_ALLOWED_CHAT_ID="your_chat_id"
```

## 4) Run the built server

```bash
node dist/main.js
```

The server runs over stdio, so you usually start it from your MCP client config.

## 5) Connect from your MCP client

Point your MCP client to:

- Command: `node`
- Args: `dist/main.js`
- Env:
  - `TELEGRAM_BOT_TOKEN`
  - `TELEGRAM_ALLOWED_CHAT_ID`

## 6) Use the `notify` tool

Call the tool with:

```json
{
  "message": "Build finished successfully"
}
```

If delivery works, the tool returns:

- `delivered: true`
- `telegram_message_id: <number>`

You will receive the message in Telegram with a bell prefix, for example:

`🔔 Build finished successfully`

## Local development

The consumer flow runs the built JavaScript file with Node.js. Local development uses Bun so you can install dependencies, run the TypeScript source directly, and rebuild `dist/main.js`.

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
  - `TELEGRAM_ALLOWED_CHAT_ID`

Run local checks:

```bash
bun run build:js
bun run format:fix
bun run lint:fix
bun run types:check
bun run test
bunx knip
```
