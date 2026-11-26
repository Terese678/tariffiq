// tariff.js
// Sends the shipment to our own backend and returns the result.
// The AI key now lives on the server, not in the browser.

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function analyzeTariff(shipment) {
  const response = await fetch(`${API_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(shipment)
  })

  // stop here if the server said no (unknown product, no rate found)
  if (!response.ok) throw new Error(`Server error ${response.status}`)

  return response.json()
}