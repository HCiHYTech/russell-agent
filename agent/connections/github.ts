import { connect } from "@vercel/connect/eve";
import { defineMcpClientConnection } from "eve/connections";

export default defineMcpClientConnection({
  url: "https://api.githubcopilot.com/mcp/",
  description:
    "GitHub: repositories, files, code search, issues, pull requests, reviews, commits, branches, releases, and Actions workflow runs.",
  auth: connect("github/prj_FPn8YlA8sAoC6uoJ3qNaxWp5AgNt"),
});
