// this register tool has a single responsibility to expose the app's existing analysis to an AI
// agent through WebMCP with no new logic living here. Every tool below just calls
// runAnalysis(), the same funtion that the tariffform is already using.

export function registerTariffTools({ runAnalysis, getLastFormData }) {

  // WebMCP may not exist in every browser — skip registration if unsupported
  if (typeof document === 'undefined' || !document.modelContext) return

  // Lets an agent run a full tariff analysis from scratch
  document.modelContext.registerTool({
    name: 'analyze_tariff',
    description: 'Analyzes US import tariff, duty cost, and landed cost for a product shipment.',
    inputSchema: {
      type: 'object',
      properties: {
        product: { type: 'string', description: 'What is being imported, e.g. "ceramic mugs"' },
        originCountry: { type: 'string', description: 'Country the product ships from' },
        quantity: { type: 'number', description: 'Number of units in the shipment' },
        unitPrice: { type: 'number', description: 'Price per unit in USD' }
      },
      required: ['product', 'originCountry', 'quantity', 'unitPrice']
    },
    execute: async (input) => {
      const result = await runAnalysis(input)
      // Summarize the result in plain text for the agent to relay back
      return { content: [{ type: 'text', text: summarize(input.originCountry, result) }] }
    }
  })

  // Lets an agent compare a different origin country against the last analysis,
  // without needing every field re-supplied e.g. "what if from Vietnam instead"
  document.modelContext.registerTool({
    name: 'switch_origin_country',
    description: 'Re-runs the last tariff analysis with a different origin country, for comparing sourcing options.',
    inputSchema: {
      type: 'object',
      properties: {
        originCountry: { type: 'string', description: 'The alternative origin country to compare against' }
      },
      required: ['originCountry']
    },
    execute: async (input) => {
      const last = getLastFormData()
      if (!last) return { content: [{ type: 'text', text: 'Run analyze_tariff first — nothing to compare against yet.' }] }

      const result = await runAnalysis({ ...last, originCountry: input.originCountry })
      return { content: [{ type: 'text', text: summarize(input.originCountry, result) }] }
    }
  })
}

// Shared by both tools — formats a tariff result into one plain-text line
function summarize(country, result) {
  return `From ${country}: tariff rate ${result.tariffRate}, duty $${result.dutyAmount}, landed cost $${result.landedCost}. ${result.marginImpact}`
}