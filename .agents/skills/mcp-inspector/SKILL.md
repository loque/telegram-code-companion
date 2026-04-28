---
name: mcp-inspector
description: Use this skill when the user wants to test, debug, inspect, or validate an MCP server with the official MCP Inspector, especially when they mention `npx @modelcontextprotocol/inspector`, MCP tools/resources/prompts, stdio/SSE/streamable HTTP transports, MCP server configs, or needing a quick local debugging loop for an MCP server. This skill explains how to launch the Inspector UI and CLI, connect it to local or remote MCP servers, pass arguments and environment variables, use config files, and avoid unsafe exposure of the Inspector proxy.
version: 0.1.0
---

# MCP Inspector

Use the official MCP Inspector when a developer needs to interactively test or script-check an MCP server. It provides a browser UI plus a local proxy, and it can also run in CLI mode for fast feedback loops.

Source: https://github.com/modelcontextprotocol/inspector

## First Checks

Before running commands, identify:

- The server transport: `stdio`, `sse`, or `streamable-http`.
- The launch command or URL for the server.
- Whether the server needs environment variables, secrets, or command-line arguments.
- Whether the user wants visual exploration in the UI or a scriptable command for automation.
- Whether the current machine has a compatible Node.js installed. The Inspector currently documents Node.js `^22.7.5`.

Prefer `npx @modelcontextprotocol/inspector` for normal use. Do not clone the Inspector repo unless the user is modifying the Inspector itself.

## UI Mode

Use UI mode for interactive development, exploring tools/resources/prompts, inspecting JSON responses, testing tool inputs, and debugging errors.

Start the Inspector without a preselected server:

```bash
npx @modelcontextprotocol/inspector
```

By default, the UI opens at:

```text
http://localhost:6274
```

The Inspector also starts a proxy server on port `6277`. The proxy is what connects the browser UI to MCP servers.

### Local stdio server

For a Node server built at `build/index.js`:

```bash
npx @modelcontextprotocol/inspector node build/index.js
```

Pass server arguments after the server command:

```bash
npx @modelcontextprotocol/inspector node build/index.js arg1 arg2
```

Pass environment variables with Inspector `-e` flags:

```bash
npx @modelcontextprotocol/inspector -e API_KEY="$API_KEY" -e DEBUG=true node build/index.js
```

When a server also has flags that could be confused with Inspector flags, separate Inspector flags from the server command with `--`:

```bash
npx @modelcontextprotocol/inspector -e API_KEY="$API_KEY" -- node build/index.js --server-flag
```

### Custom ports

Use custom ports when defaults are busy:

```bash
CLIENT_PORT=8080 SERVER_PORT=9000 npx @modelcontextprotocol/inspector node build/index.js
```

Then open the client port in the browser.

### Remote SSE or streamable HTTP server

For remote or already-running local HTTP transports, launch the UI and configure the transport and URL in the sidebar.

You can also prefill connection details with query parameters:

```text
http://localhost:6274/?transport=sse&serverUrl=http://localhost:8787/sse
http://localhost:6274/?transport=streamable-http&serverUrl=http://localhost:8787/mcp
```

If the remote server needs bearer authentication, enter the token in the UI. The Inspector sends it in the authorization header; the header name can be overridden in the sidebar.

## Config Files

Use a config file when working with multiple servers, repeated launch settings, or exported configs from the Inspector UI.

```bash
npx @modelcontextprotocol/inspector --config path/to/config.json --server my-server
```

Example:

```json
{
  "mcpServers": {
    "my-server": {
      "type": "stdio",
      "command": "node",
      "args": ["build/index.js"],
      "env": {
        "DEBUG": "true"
      }
    },
    "local-http": {
      "type": "streamable-http",
      "url": "http://localhost:3000/mcp"
    },
    "local-sse": {
      "type": "sse",
      "url": "http://localhost:3000/sse"
    }
  }
}
```

If the config contains exactly one server, or a server named `default-server`, the Inspector can select it automatically:

```bash
npx @modelcontextprotocol/inspector --config mcp.json
```

The UI can export either a single server entry or a complete `mcp.json`-style servers file. Use those exports when the user wants to reuse a known-good Inspector connection in Cursor, Claude Code, or another MCP client.

## CLI Mode

Use CLI mode for quick verification, CI checks, repeatable debugging, and agent-driven MCP development loops where opening a browser is unnecessary.

Basic CLI connection:

```bash
npx @modelcontextprotocol/inspector --cli node build/index.js
```

With a config file:

```bash
npx @modelcontextprotocol/inspector --cli --config path/to/config.json --server my-server
```

List tools:

```bash
npx @modelcontextprotocol/inspector --cli node build/index.js --method tools/list
```

Call a tool:

```bash
npx @modelcontextprotocol/inspector --cli node build/index.js \
  --method tools/call \
  --tool-name mytool \
  --tool-arg key=value \
  --tool-arg another=value2
```

Pass JSON as a tool argument by quoting it:

```bash
npx @modelcontextprotocol/inspector --cli node build/index.js \
  --method tools/call \
  --tool-name mytool \
  --tool-arg 'options={"format":"json","max_tokens":100}'
```

List resources or prompts:

```bash
npx @modelcontextprotocol/inspector --cli node build/index.js --method resources/list
npx @modelcontextprotocol/inspector --cli node build/index.js --method prompts/list
```

Connect to a remote MCP server:

```bash
npx @modelcontextprotocol/inspector --cli https://my-mcp-server.example.com
```

Use streamable HTTP transport and custom headers:

```bash
npx @modelcontextprotocol/inspector --cli https://my-mcp-server.example.com \
  --transport http \
  --method tools/list \
  --header "X-API-Key: $API_KEY"
```

When debugging in an agent workflow, prefer starting with `tools/list`, then call one narrow tool with representative arguments, then report the exact command and relevant output.

## Security Guidance

The Inspector proxy can spawn local processes and connect to specified MCP servers. Treat it as a local development tool, not a public service.

Follow these defaults:

- Keep the Inspector bound to `localhost`.
- Do not set `HOST=0.0.0.0` unless the user explicitly needs LAN access in a trusted environment.
- Do not expose ports `6274` or `6277` to untrusted networks.
- Do not disable proxy authentication.
- Do not paste real secrets into config files that may be committed.

The proxy requires authentication by default and prints a session token in the terminal. If the browser does not auto-open with the token, copy the token from the terminal, open the UI configuration, set `Proxy Session Token`, and save.

Only mention `DANGEROUSLY_OMIT_AUTH=true` as something to avoid. It disables an important protection around a tool that can execute local processes.

## Troubleshooting

If the UI does not connect:

1. Confirm the server command works by itself, for example `node build/index.js`.
2. Confirm the Inspector terminal printed a session token and the browser has the same proxy token configured.
3. Check whether ports `6274` or `6277` are already in use; if so, set `CLIENT_PORT` and `SERVER_PORT`.
4. Verify environment variables are passed with `-e NAME=value` before the server command.
5. Use `--` if server flags are being interpreted as Inspector flags.
6. For SSE or streamable HTTP, verify the URL path and transport type match the server implementation.
7. Increase request timeouts in the UI configuration for long-running tools.

If CLI calls fail:

1. Run `--method tools/list` first to prove the connection and tool names.
2. Quote JSON arguments so the shell does not rewrite them.
3. For remote servers, add required headers with `--header`.
4. For config files, confirm the selected `--server` name exists under `mcpServers`.

## Response Pattern

When helping a user use the Inspector, give them:

- The exact command to run.
- The URL to open, if using UI mode.
- Any required environment variable handling.
- The next action inside the UI or the next CLI command to verify the server.
- Any relevant security warning if the command changes host binding, auth, or secrets handling.

Keep explanations brief and command-centered. The Inspector is most useful when the user can run one command, observe the connection, and iterate.
