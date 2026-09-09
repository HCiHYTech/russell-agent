# Changelog

## [v0.1.0] — 2026-09-09

**Task:** Connect Russell to GitHub.

**Branch:** `claude/russell-github-connection-1ti8b8`

**Status:** Code complete, typecheck passing. Blocked on a one-time Vercel Connect
connector being created, attached, and authorized before the connection can resolve
a token at runtime (see Follow-ups).

**What changed:**

- Added `agent/connections/github.ts`, an MCP connection to GitHub's official remote
  MCP server at `https://api.githubcopilot.com/mcp/`, authorized through Vercel
  Connect and matching the existing Linear/Notion/Sentry/Supabase/Vercel/Zapier
  connection pattern.
- Russell discovers the tools through `connection_search` and calls them as
  `github__<tool>`.
- Requested the `actions` toolset explicitly via the `X-MCP-Toolsets` header.

**Files touched:**

- `agent/connections/github.ts` (new)
- `CHANGELOG.md` (new)

**Commands run** (bash, from the repo root):

- `pnpm install`
- `npx tsc --noEmit` — passes.
- `eve build` — fails in this environment only; `eve build` fetches AI Gateway model
  metadata for `openai/gpt-5.6-sol` and the sandbox egress proxy returns HTTP 403.
  Verified an identical failure with the new file removed, so it is pre-existing and
  unrelated to this change.

**Decisions made:**

- Filename is lowercase `github.ts`. eve derives the runtime connection name from the
  filename, so this keeps tools named `github__*` and consistent with the other six.
- MCP connection rather than an OpenAPI connection over the REST spec. eve's guidance
  is to prefer MCP when the service already exposes an MCP server, and GitHub does.
- No import or registration statement anywhere — eve auto-discovers every file under
  `agent/connections/`.
- One connection covers both organizations. The GitHub MCP server scopes access by the
  OAuth grant, not by anything expressible in the file, so org coverage is an
  authorization step rather than a code change.
- Connect service identifier is `github`, not the MCP host. The other six connections
  in this repo pass their MCP host to `connect(...)`, but that is a coincidence of
  those providers rather than a rule: eve's docs state the `vercel connect create`
  service identifier "is not necessarily the same as an MCP runtime URL or OpenAPI
  base URL", and both GitHub examples in the toolchain use the `github/<name>` UID
  form — `connect("github/github")` in the eve OpenAPI docs and
  `connectGitHubAdapter("github/acme-github")` in `@vercel/connect`.
- Auth is user-scoped `connect(...)`, matching the other six connections, rather than
  app-scoped.
- Sent `X-MCP-Toolsets: default,actions`. The remote server's defaults are context,
  repos, issues, pull_requests, and users; `actions` is not among them, so without this
  header the Actions-run tools named in the connection description would not be
  discoverable. Releases, branches, and commits need no extra toolset — they are served
  by `repos`, which is already a default.
- No `tools.allow` / `tools.block` filter and no approval gate, matching the existing
  connections in this repo. Flagged as a follow-up rather than decided unilaterally,
  since it changes runtime behaviour for every GitHub write.

**Follow-ups:**

- Create and attach the Connect connector so the UID in `connect(...)` resolves, then
  authorize it in a browser. From the repo root:
  `vercel link`, then
  `vercel connect create github --name prj_FPn8YlA8sAoC6uoJ3qNaxWp5AgNt`, then
  `vercel connect attach <connector-uid> --yes`.
  If `github` is rejected as a service identifier, the CLI error lists the valid ones.
- Install/approve the resulting GitHub App in **both** the AIFriendDan and HCiHYTech
  organizations. Authorizing only one leaves the other invisible to Russell.
- User-scoped auth needs an authenticated user on the session. If Russell later runs
  GitHub work from a schedule, that path carries no end-user principal and will fail
  with `principal_required`; switch to app-scoped auth for background work.
- Consider an approval gate on destructive GitHub tools (merge, delete, force-push)
  once real usage is observed.
