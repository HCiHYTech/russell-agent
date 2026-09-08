import { connect } from "@vercel/connect/eve";
import { defineMcpClientConnection } from "eve/connections";

export default defineMcpClientConnection({
  url: "https://api.githubcopilot.com/mcp/",
  description:
    "GitHub for the AIFriendDan and HCiHYTech organizations: repositories, issues, pull requests, reviews, commits, branches, releases, and Actions runs.",
  auth: connect("api.githubcopilot.com/prj_FPn8YlA8sAoC6uoJ3qNaxWp5AgNt"),
});
