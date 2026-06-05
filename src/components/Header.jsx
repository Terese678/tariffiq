// Header.jsx
// Renders the top bar of TariffIQ — logo, name, and tagline.
// Purely presentational — no logic, no state, no props needed.

export default function Header() {
  return (
    <header className="header">

      {/* App name and tagline */}
      <div className="header-brand">
        <h1 className="header-logo">TariffIQ</h1>
        <p className="header-tagline">Know your import costs before they know you</p>
      </div>

    </header>
  )
}