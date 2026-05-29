# GitHub Repository Connection & Push Instructions

**Repository URL:** https://github.com/sudanexportplatforms-cmyk/sudan-export

---

## 1. Connecting the Replit Project to GitHub

The project uses the Replit GitHub integration for OAuth-based authentication. No personal access token needs to be created manually.

To connect or reconnect from inside Replit:

1. Open the **Tools** panel (left sidebar) → **Git**.
2. If no remote is configured, Replit will prompt you to connect a GitHub account.
3. Alternatively, connect via the **Integrations** panel → search for **GitHub** → follow the OAuth flow.

Once connected, the authenticated remote is configured automatically. You can also set it manually in a terminal:

```bash
# Replace <TOKEN> with your GitHub personal access token (or use the Replit integration token)
git remote add origin https://x-access-token:<TOKEN>@github.com/sudanexportplatforms-cmyk/sudan-export.git

# Verify it was added
git remote -v
```

---

## 2. Verifying the Remote Repository URL

```bash
git remote -v
```

Expected output:

```
origin  https://github.com/sudanexportplatforms-cmyk/sudan-export.git (fetch)
origin  https://github.com/sudanexportplatforms-cmyk/sudan-export.git (push)
```

If the URL is wrong, remove and re-add:

```bash
git remote remove origin
git remote add origin https://github.com/sudanexportplatforms-cmyk/sudan-export.git
```

---

## 3. Checking Git Status

Always check what has changed before committing:

```bash
git status
```

To see a compact diff of staged and unstaged changes:

```bash
git diff --stat
git diff --cached --stat   # staged only
```

To view the full commit history:

```bash
git log --oneline -10
```

---

## 4. Committing Changes

Stage all modified and new files:

```bash
git add -A
```

Or stage specific files:

```bash
git add lib/db/src/schema/products.ts
git add artifacts/api-server/src/routes/rfqs.ts
```

Commit with a descriptive message (see [Recommended Commit Message Format](#10-recommended-commit-message-format) below):

```bash
git commit -m "feat(rfq): add close/cancel status transitions with email notifications"
```

---

## 5. Pushing to the Main Branch

Push to the remote `main` branch and set it as the upstream tracking branch:

```bash
git push -u origin main
```

On subsequent pushes (after upstream is set):

```bash
git push
```

To push a different local branch:

```bash
git push origin your-branch-name
```

---

## 6. Pulling Latest Changes

Fetch and merge the latest remote changes into your current branch:

```bash
git pull origin main
```

To fetch without merging (safe inspection):

```bash
git fetch origin
git log origin/main --oneline -5   # see what's new
git merge origin/main              # merge when ready
```

---

## 7. Handling Common Git Issues

### Remote already exists

```
error: remote origin already exists
```

**Fix:**

```bash
git remote remove origin
git remote add origin https://github.com/sudanexportplatforms-cmyk/sudan-export.git
```

---

### Authentication required / permission denied

```
remote: Repository not found
fatal: Authentication failed for 'https://github.com/...'
```

**Fix:**

1. Ensure the GitHub integration is connected in Replit (Integrations panel → GitHub).
2. If using a personal access token, check it has `repo` scope and hasn't expired.
3. Re-add the remote with a fresh token:

```bash
git remote set-url origin https://x-access-token:<NEW_TOKEN>@github.com/sudanexportplatforms-cmyk/sudan-export.git
```

---

### Merge conflicts

When `git pull` results in conflicts:

```
CONFLICT (content): Merge conflict in lib/db/src/schema/rfqs.ts
Automatic merge failed; fix conflicts and then commit the result.
```

**Fix:**

1. Open the conflicting file(s). Look for conflict markers:

```
<<<<<<< HEAD
  your local change
=======
  incoming change from remote
>>>>>>> origin/main
```

2. Edit the file to keep the correct version and remove all markers.
3. Stage the resolved file and complete the merge:

```bash
git add lib/db/src/schema/rfqs.ts
git commit -m "fix: resolve merge conflict in rfqs schema"
```

---

### Branch mismatch / diverged histories

```
hint: Updates were rejected because the tip of your current branch is behind its remote counterpart
```

**Fix (safe):** Pull first, then push:

```bash
git pull --rebase origin main
git push origin main
```

**Fix (force — only use if you are certain the remote can be overwritten):**

```bash
git push origin main --force
```

> **Warning:** `--force` overwrites the remote branch history. Only use this on branches where no one else has work.

---

### Accidentally committed to wrong branch

```bash
# Move last commit to a new branch
git branch new-branch-name
git reset --hard HEAD~1   # remove from current branch
git checkout new-branch-name
git push origin new-branch-name
```

---

## 8. Confirming Sensitive Files Are Not Committed

The `.gitignore` at the project root excludes `.env` files:

```bash
# Verify .env is ignored
git check-ignore -v .env
# Expected: .gitignore:1:.env   .env

# Confirm it is NOT tracked
git ls-files .env
# Expected: (no output)
```

If `.env` was accidentally committed in the past, remove it from tracking:

```bash
git rm --cached .env
git commit -m "chore: stop tracking .env file"
git push
```

Never commit real values for `DATABASE_URL`, `SESSION_SECRET`, `CLERK_SECRET_KEY`, or `RESEND_API_KEY`. Use the Replit **Secrets** panel for all sensitive values.

---

## 9. Confirming `.env.example` Is Committed

`.env.example` contains only placeholder values and **should** be committed so that collaborators know which variables are required.

```bash
# Verify it is tracked
git ls-files .env.example
# Expected: .env.example

# If missing, add it
git add .env.example
git commit -m "chore: add .env.example with documented variables"
git push
```

---

## 10. Recommended Commit Message Format

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body — explain the why, not the what]

[optional footer — BREAKING CHANGE or issue refs]
```

### Types

| Type | When to use |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes only |
| `chore` | Build, tooling, config, dependencies |
| `refactor` | Code restructuring without behaviour change |
| `test` | Adding or updating tests/seed data |
| `style` | Formatting, whitespace, no logic changes |
| `perf` | Performance improvements |

### Scope examples

`rfq`, `quotation`, `company`, `email`, `db`, `health`, `auth`, `ui`, `seed`, `docs`, `deps`

### Examples

```bash
git commit -m "feat(rfq): notify approved suppliers on new RFQ creation"
git commit -m "fix(auth): prevent role escalation to admin via /api/users/me"
git commit -m "chore(deps): add resend email SDK to api-server"
git commit -m "docs: add github workflow and deployment guides"
git commit -m "feat(health): add detailed health endpoint with DB + worker status"
git commit -m "test(seed): add sample RFQ and quotation to seed script"
```

### Rules

- Use the **imperative mood** in the short description: "add feature" not "added feature"
- Keep the short description under **72 characters**
- Reference issue numbers in the footer when applicable: `Closes #12`
- Mark breaking changes: `BREAKING CHANGE: removed /api/v1 prefix`
