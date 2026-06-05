// TariffResult.jsx
// Displays the AI's tariff analysis in a clear, readable format.
// Receives the result object from App.jsx — no API calls here.

export default function TariffResult({ result }) {
  return (
    <div className="tariff-result">

      {/* Summary cards — the three numbers that matter most */}
      <div className="result-cards">

        <div className="result-card">
          <p className="card-label">Tariff Rate</p>
          <p className="card-value">{result.tariffRate}</p>
        </div>

        <div className="result-card">
          <p className="card-label">Duty Amount</p>
          <p className="card-value">${result.dutyAmount.toLocaleString()}</p>
        </div>

        <div className="result-card highlight">
          <p className="card-label">Total Landed Cost</p>
          <p className="card-value">${result.landedCost.toLocaleString()}</p>
        </div>

      </div>

      {/* Plain English margin impact */}
      <div className="result-section">
        <h3>Impact on Your Margins</h3>
        <p>{result.marginImpact}</p>
      </div>

      {/* ORACLE's plain English advice for this business owner */}
      <div className="result-section advice">
        <h3>TariffIQ Advice</h3>
        <p>{result.advice}</p>
      </div>

    </div>
  )
}