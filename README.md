# Telegram Code Companion (MCP)

This project is a small MCP server that lets your coding agent send you Telegram messages.

Right now, the implemented tool is:

- `notify`: send a one-way status message to Telegram

## What you need

- [Bun](https://bun.sh/) installed
- A Telegram account
- A Telegram bot token from [@BotFather](https://t.me/BotFather)

## 1) Install the project

```bash
bun install
```

## 2) Create your Telegram bot token

1. Open Telegram and message `@BotFather`
2. Run `/newbot`
3. Follow the prompts
4. Copy the bot token

## 3) Find your Telegram chat ID

1. Open a chat with your bot
2. Send any message (for example: `hi`)
3. Run this command (replace `<BOT_TOKEN>`):

```bash
curl "https://api.telegram.org/bot<BOT_TOKEN>/getUpdates"
```

4. In the JSON response, find:

- `result[0].message.chat.id`

That number is your `TELEGRAM_ALLOWED_CHAT_ID`.

## 4) Set environment variables

Set these in your shell before starting the server:

```bash
export TELEGRAM_BOT_TOKEN="your_bot_token"
export TELEGRAM_ALLOWED_CHAT_ID="your_chat_id"
```

## 5) Start the MCP server

```bash
bun run src/main.ts
```

The server runs over stdio, so you usually start it from your MCP client config.

## 6) Connect from your MCP client

Point your MCP client to this command:

- Command: `bun`
- Args: `run src/main.ts`
- Env:
  - `TELEGRAM_BOT_TOKEN`
  - `TELEGRAM_ALLOWED_CHAT_ID`

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

You will receive the message in Telegram with a bell prefix, for example:

`🔔 Build finished successfully`

## Local checks (for contributors)

```bash
bun run format:fix
bun run lint:fix
bun run types:check
bun run test
bunx knip
```
