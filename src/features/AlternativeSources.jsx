// AlternativeSources.jsx
// Shows cheaper source countries for the same product.
// Helps the business owner see where they could save money
// by switching their supplier's country of origin.
// Receives alternatives array from App.jsx — no logic here.

export default function AlternativeSources({ alternatives }) {

  // Nothing to show if AI returned no alternatives
  if (!alternatives || alternatives.length === 0) return null

  return (
    <div className="alternatives">

      <h3>Cheaper Alternatives</h3>
      <p className="alternatives-sub">
        The same product from these countries attracts lower US tariffs:
      </p>

      {/* One row per alternative country */}
      <div className="alternatives-list">
        {alternatives.map((alt, i) => (
          <div key={i} className="alternative-card">

            {/* Country name */}
            <p className="alt-country">{alt.country}</p>

            {/* Tariff rate for that country */}
            <p className="alt-rate">Tariff: {alt.rate}</p>

            {/* How much they would save vs current choice */}
            <p className="alt-saving">Save: {alt.saving}</p>

          </div>
        ))}
      </div>

    </div>
  )
}