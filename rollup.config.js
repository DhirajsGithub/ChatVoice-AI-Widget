import terser from "@rollup/plugin-terser";

export default {
  input: "loader/embed.js",
  output: {
    file: "dist/agent-widget.js",
    format: "iife",
    name: "AgentWidgetLoader",
  },
  plugins: [terser()],
};
