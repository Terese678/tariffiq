// Loader.jsx
// Shown while the AI is analyzing the tariff data.
// Accepts a message prop so the calling component controls the text.

export default function Loader({ message = 'Analyzing your tariff...' }) {
  return (
    <div className="loader">

      {/* Spinning indicator */}
      <div className="loader-spinner" />

      {/* Dynamic message passed from parent */}
      <p className="loader-text">{message}</p>

    </div>
  )
}
