// TariffForm.jsx
// The main input form where the business owner enters their shipment details.
// Collects product, origin country, quantity, and unit price.
// Calls onSubmit with the form data — no API calls happen here.

import { useState } from 'react'

export default function TariffForm({ onSubmit, loading }) {

  // Form state — one object tracks all four fields
  const [form, setForm] = useState({
    product: '',
    originCountry: '',
    quantity: '',
    unitPrice: ''
  })

  // Generic handler — updates whichever field changed by name
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Validate and pass data up to App.jsx for the API call
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.product || !form.originCountry || !form.quantity || !form.unitPrice) return
    onSubmit({
      ...form,
      quantity: Number(form.quantity),
      unitPrice: Number(form.unitPrice)
    })
  }

  return (
    <form className="tariff-form" onSubmit={handleSubmit}>

      {/* Product being imported */}
      <div className="form-group">
        <label>What are you importing?</label>
        <input
          name="product"
          type="text"
          placeholder="e.g. Ceramic mugs, LED lights, Sports shoes"
          value={form.product}
          onChange={handleChange}
        />
      </div>

      {/* Country the product ships from */}
      <div className="form-group">
        <label>Country of origin</label>
        <input
          name="originCountry"
          type="text"
          placeholder="e.g. China, Vietnam, Mexico"
          value={form.originCountry}
          onChange={handleChange}
        />
      </div>

      {/* Number of units in the shipment */}
      <div className="form-group">
        <label>Quantity (units)</label>
        <input
          name="quantity"
          type="number"
          placeholder="e.g. 500"
          value={form.quantity}
          onChange={handleChange}
          min="1"
        />
      </div>

      {/* Price per unit in USD */}
      <div className="form-group">
        <label>Price per unit (USD)</label>
        <input
          name="unitPrice"
          type="number"
          placeholder="e.g. 3.50"
          value={form.unitPrice}
          onChange={handleChange}
          min="0.01"
          step="0.01"
        />
      </div>

      {/* Submit — disabled while AI is processing */}
      <button type="submit" className="analyze-btn" disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze My Tariff'}
      </button>

    </form>
  )
}