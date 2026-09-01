// App.jsx
// The skeleton — manages all state and connects every feature.
// No business logic lives here — it delegates to features and api.

import { useState, useEffect, useRef } from 'react'
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

// WebMCP lets an AI agent drive analysis directly on this page
import { registerTariffTools } from './webmcp/registerTools'

export default function App() {

  // The structured tariff result returned from the AI
  const [result, setResult] = useState(null)

  // True while waiting for the AI to respond
  const [loading, setLoading] = useState(false)

  // Holds any error message to show the user
  const [error, setError] = useState(null)

  // Remembers the last submitted form data so WebMCP tools (like
  // switch_origin_country) can re-run analysis without needing every field again
  const lastFormDataRef = useRef(null)

  // Runs a tariff analysis. Called by TariffForm on submit, and also
  // called directly by WebMCP tools same function, same state, so
  // results appear live on screen either way.
  const runAnalysis = async (formData) => {
    setLoading(true)
    setError(null)
    setResult(null)
    lastFormDataRef.current = formData

    try {
      // Send to AI and get structured tariff analysis back
      const data = await analyzeTariff(formData)
      setResult(data)
      return data
    } catch (err) {
      // Show a friendly error don't expose raw error to user
      setError('Something went wrong analyzing your tariff. Please try again.')
      console.error('TariffIQ error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // TariffForm still calls this exact prop name — unchanged
  const handleSubmit = runAnalysis

  // Register WebMCP tools once, on mount
  useEffect(() => {
    registerTariffTools({
      runAnalysis,
      getLastFormData: () => lastFormDataRef.current
    })
  }, [])

  return (
    <div className="app">

      {/* Top bar logo and tagline */}
      <Header />

      <main className="main">

        {/* Input form; always visible so user can run another analysis */}
        <TariffForm onSubmit={handleSubmit} loading={loading} />

        {/* Loading state, shown while AI is processing */}
        {loading && <Loader message="Analyzing your tariff situation..." />}

        {/* Error state shown if API call fails */}
        {error && <p className="error">{error}</p>}

        {/* Results shown once AI returns data */}
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