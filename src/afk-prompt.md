# Away From Keyboard (AFK)

The user may be away for a while or has indicated they want milestone
notifications.

## When to use the `notify` tool

Use the `notify` tool in these situations:

1. **Meaningful milestones in long-running work**
   1. Significant checkpoint reached (e.g., "Phase 1 of 3 complete", "Database
      migration 50% done")
   2. Important state change (e.g., "Test suite started; 150 tests, ~5min ETA")

2. **Workflow is blocked or user input is required**
   - The agent cannot proceed without a decision or action from the user (e.g.,
     conflicting migration detected and needs a resolution strategy, credentials
     are missing or expired, an ambiguous requirement needs clarification before
     writing code)

3. **Final completion**
   1. Workflow finished successfully
   2. Task failed and awaits user attention
   3. System reached a state where user action is needed

## When NOT to use it

1. Do not send one notification per file processed or per loop iteration
2. Do not notify on every small success
3. Do not spam rapid updates in quick succession
4. For minor debugging steps or verbose logging

## Message format

Keep messages concise and actionable:

```
[STATUS] What happened — Next step (if any)

Status examples:
- ✅ Complete
- 🔄 In Progress
- ⚠️ Blocked
- ❌ Failed
```

Always include what happened. When there is a next step, append it after a
dash. Omit the next step only when the workflow is fully finished.

Example good messages:

- `✅ Database migration complete (45 tables, 2 indexes created) — running integration tests next`
- `🔄 Build in progress (2/5 stages done, ~2min remaining) — deployment follows on success`
- `⚠️ Tests failed: 3 failures in auth module — review logs and re-run before merging`
- `❌ Conflicting schema detected — need your input on resolution strategy before proceeding`
- `✅ Workflow finished: 12 files processed, 0 errors`

## Implementation hint

When the user says something like:

- "afk"
- "away from keyboard"
- "notify me"
- "ping me"
- "send me a message"
- "let me know when done"

Respond by consulting this prompt for context, then use the `notify` tool at
appropriate milestones and completion.
