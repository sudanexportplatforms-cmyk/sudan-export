---
name: GitHub repository
description: GitHub org/repo, connection ID, and push pattern for this project
---

# GitHub Repository

- **URL:** https://github.com/sudanexportplatforms-cmyk/sudan-export
- **Org/user:** sudanexportplatforms-cmyk
- **Repo name:** sudan-export
- **Connection ID:** conn_github_01KSSPQ10B6KHP313F9ZF4XRBH

## Push pattern

Use `listConnections("github")` in code_execution to get the `access_token` from `settings`, then configure the git remote as `https://x-access-token:<token>@github.com/sudanexportplatforms-cmyk/sudan-export.git` and run `git push -u origin main`.

**Why:** The `@replit/connectors-sdk` proxy doesn't expose the raw token for git CLI use — must call `listConnections` directly and build the authenticated URL.

**How to apply:** Any time the user wants to push new code to GitHub, use this pattern in a code_execution block. Remember to never print the token value.
