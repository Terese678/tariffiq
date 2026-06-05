// tariff.js
// Single responsibility: send product details to AI, return structured tariff analysis.
// All other files import analyzeTariff() from here — nothing else lives in this file.

const API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = 'anthropic/claude-sonnet-4-5'

export async function analyzeTariff({ product, originCountry, quantity, unitPrice }) {
  
  // Calculate total shipment value upfront so the AI has full context
  const totalValue = (quantity * unitPrice).toFixed(2)

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // OpenRouter expects a Bearer token for authentication
      'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      messages: [{
        role: 'user',
        // Prompt engineered to return strict JSON — no extra text, no markdown
        content: `You are a US import tariff expert helping a small business owner.

Product: ${product}
Origin: ${originCountry}
Quantity: ${quantity} units
Unit price: $${unitPrice}
Total value: $${totalValue}

Return ONLY a JSON object with these exact fields:
{
  "tariffRate": "e.g. 25%",
  "dutyAmount": 125.00,
  "landedCost": 625.00,
  "marginImpact": "plain english one sentence",
  "alternatives": [
    { "country": "Vietnam", "rate": "12%", "saving": "$65" }
  ],
  "advice": "one paragraph plain english advice for this business owner"
}`
      }]
    })
  })

  const data = await response.json()
  
  // Extract the message text from OpenRouter's response structure
  const text = data.choices[0].message.content.trim()
  
  // Strip any markdown code fences the AI might have added despite instructions
  const clean = text.replace(/```json|```/g, '').trim()
  
  // Parse and return the structured tariff object to the caller
  return JSON.parse(clean)
}