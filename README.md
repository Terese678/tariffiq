# Tariffiq

AI agent that analyzes US import tariffs for small business owners — know your duty costs, margin impact, and cheaper source countries before you order.

Live app: [tariffiq-gamma.vercel.app](https://tariffiq-gamma.vercel.app)

## What it does

Enter a product, its country of origin, quantity, and unit price, and Tariffiq calculates:
- Total landed cost after import tariffs
- The impact on your profit margins
- Cheaper sourcing alternatives from other origin countries, with potential savings

## WebMCP integration

This app exposes two tools via [WebMCP](https://github.com/webmachinelearning/webmcp), so an AI agent can run tariff analysis directly on this page — not just describe it in a chat window.

**Tools exposed:**
- `analyze_tariff` — runs a full tariff analysis for a product, origin country, quantity, and unit price
- `switch_origin_country` — re-runs the most recent analysis using a different origin country, so an agent can quickly compare sourcing options (e.g. China vs. Vietnam vs. Mexico) without re-entering the product, quantity, or price

Both tools call the app's existing analysis logic directly, so results update live in the UI — the same page a human is looking at updates in real time as the agent works.

**How to test:**
1. Open the deployed URL in Google Chrome with `chrome://flags/#enable-webmcp-testing` enabled.
2. Open Chrome DevTools → Application → WebMCP to see `analyze_tariff` and `switch_origin_country` listed as available tools.
3. Invoke a tool directly from the panel (or via a WebMCP-enabled agent) and watch the result appear live on the page, without manually filling the form.

## Setup

git clone https://github.com/Terese678/tariffiq.git
cd tariffiq
npm install

## Environment variables

Create a `.env` file in the project root with:

VITE_OPENROUTER_API_KEY=your_key_here

## Run locally

npm run dev

## License

MIT — see [LICENSE](./LICENSE)

---

Built for the [OpenAI WebMCP Challenge](https://webmcp.devpost.com/)