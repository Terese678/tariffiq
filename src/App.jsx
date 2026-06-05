// App.jsx
// The skeleton — manages all state and connects every feature.
// No business logic lives here — it delegates to features and api.

import { useState } from 'react'
import './App.css'

// Components
import Header from './components/Header'
import Loader from './components/Loader'

// Features
import TariffForm from './features/TariffForm'
import TariffResult from './features/TariffResult'
import AlternativeSources from './features/AlternativeSources'

// API
import { analyzeTariff } from './api/tariff'

export default function App() {

  // The structured tariff result returned from the AI
  const [result, setResult] = useState(null)

  // True while waiting for the AI to respond
  const [loading, setLoading] = useState(false)

  // Holds any error message to show the user
  const [error, setError] = useState(null)

  // Called by TariffForm when the user submits their shipment details
  const handleSubmit = async (formData) => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Send to AI and get structured tariff analysis back
      const data = await analyzeTariff(formData)
      setResult(data)
    } catch (err) {
      // Show a friendly error — don't expose raw error to user
      setError('Something went wrong analyzing your tariff. Please try again.')
      console.error('TariffIQ error:', err)
    }

    setLoading(false)
  }

  return (
    <div className="app">

      {/* Top bar — logo and tagline */}
      <Header />

      <main className="main">

        {/* Input form — always visible so user can run another analysis */}
        <TariffForm onSubmit={handleSubmit} loading={loading} />

        {/* Loading state — shown while AI is processing */}
        {loading && <Loader message="Analyzing your tariff situation..." />}

        {/* Error state — shown if API call fails */}
        {error && <p className="error">{error}</p>}

        {/* Results — shown once AI returns data */}
        {result && (
          <>
            <TariffResult result={result} />
            <AlternativeSources alternatives={result.alternatives} />
          </>
        )}

      </main>

    </div>
  )
}