import { connect } from "@vercel/connect/eve";
import { defineMcpClientConnection } from "eve/connections";

export default defineMcpClientConnection({
  url: "https://mcp.linear.app/mcp",
  description: "Linear workspace: issues, projects, cycles, and comments.",
  auth: connect("mcp.linear.app/prj_FPn8YlA8sAoC6uoJ3qNaxWp5AgNt"),
});
