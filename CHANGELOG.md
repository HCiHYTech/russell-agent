# Changelog

## [v0.1.0] — 2026-09-08

**Task:** Connect Russell to GitHub across the AIFriendDan and HCiHYTech organizations.

**Branch:** `claude/russell-github-connections-7zji8i`

**Status:** Code complete. Blocked on the Vercel Connect connector being created and
authorized before the connection can resolve a token at runtime (see Follow-ups).

**What changed:**

- Added `agent/connections/github.ts`, an MCP connection to GitHub's official remote
  MCP server at `https://api.githubcopilot.com/mcp/`, authorized through Vercel
  Connect and matching the existing Linear/Notion/Sentry/Supabase/Vercel/Zapier
  connection pattern.
- Russell discovers the tools through `connection_search` and calls them as
  `github__<tool>`.

**Files touched:**

- `agent/connections/github.ts` (new)
- `CHANGELOG.md` (new)

**Commands run** (bash, from the repo root):

- `pnpm install`
- `pnpm typecheck` — passes
- `pnpm build` — fails in this environment only; `eve build` fetches AI Gateway model
  metadata for `openai/gpt-5.6-sol` and egress returns HTTP 403. Verified identical
  failure with the new file removed, so it is pre-existing and unrelated.

**Decisions made:**

- Filename is lowercase `github.ts`, not `GitHub.ts`. eve derives the runtime
  connection name from the filename, so lowercase keeps tools named `github__*`
  and consistent with the other six connections.
- No import or registration statement was added anywhere. eve auto-discovers every
  file under `agent/connections/`; a manual import would be redundant.
- One connection covers both organizations. The GitHub MCP server scopes access by
  the OAuth grant, not by anything expressible in the file, so org coverage is an
  authorization step rather than a code change.
- Auth is user-scoped `connect(...)`, matching the other six connections, rather
  than app-scoped.
- No `tools.allow` / `tools.block` filter and no approval gate, matching the
  existing connections in this repo.

**Follow-ups:**

- Create and attach the Connect connector so the UID in `connect(...)` resolves:
  `vercel connect create api.githubcopilot.com --name prj_FPn8YlA8sAoC6uoJ3qNaxWp5AgNt`
  then `vercel connect attach <connector-uid> --yes`. The UID in the file follows this
  repo's convention and is unverified — it could not be checked from this environment.
- Install/approve the resulting GitHub App in **both** the AIFriendDan and HCiHYTech
  organizations. Authorizing only one leaves the other invisible to Russell.
- User-scoped auth needs an authenticated user on the session. If Russell later runs
  GitHub work from a schedule, that path has no end-user principal and will fail with
  `principal_required`; switch to app-scoped auth for background work.
- Consider an approval gate on destructive GitHub tools once real usage is observed.
