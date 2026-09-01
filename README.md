## WebMCP integration

This app now exposes two tools via [WebMCP](https://github.com/webmachinelearning/webmcp), so an AI agent can run tariff analysis directly on this page — not just describe it in a chat window.

**Tools exposed:**
- `analyze_tariff` — runs a full tariff analysis for a product, origin country, quantity, and unit price
- `switch_origin_country` — re-runs the last analysis with a different origin country, for comparing sourcing options

Both tools call the app's existing analysis logic directly, so results update live in the UI — the same page a human is looking at updates in real time as the agent works.

**How to test:**
1. Open this app's deployed URL in Chrome 149+ with `chrome://flags/#enable-webmcp-testing` enabled, or in ChatGPT's desktop app using its in-app browser.
2. Ask the agent something like: *"Analyze the tariff for importing 500 ceramic mugs from China at $2 each."*
3. Watch the result appear on the page live, without manually filling the form.

Built for the [OpenAI WebMCP Challenge](https://webmcp.devpost.com/).