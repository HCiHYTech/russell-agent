import { connect } from "@vercel/connect/eve";
import { defineMcpClientConnection } from "eve/connections";

export default defineMcpClientConnection({
  url: "https://api.githubcopilot.com/mcp/",
  description:
    "GitHub for the AIFriendDan and HCiHYTech organizations: repositories, code search, issues, pull requests, reviews, commits, branches, releases, and Actions workflow runs.",
  // The Connect service identifier for GitHub is `github`, which is
  // deliberately not the MCP runtime host — unlike the other connections
  // here, where the two happen to coincide.
  auth: connect("github/prj_FPn8YlA8sAoC6uoJ3qNaxWp5AgNt"),
  // The remote server's default toolsets are context, repos, issues,
  // pull_requests, and users. Actions is not among them, so request it
  // alongside the defaults to make workflow-run tools discoverable.
  headers: { "X-MCP-Toolsets": "default,actions" },
});
