import React, { useState } from 'react'

// Form for entering origin and destination addresses
const AddressForm = ({ onSubmit }) => {
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [error, setError] = useState('')

  // Handles form submission and basic validation
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!origin.trim() || !destination.trim()) {
      setError('Both addresses are required.')
      return
    }
    setError('')
    onSubmit({ origin, destination })
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
      {/* Pickup address input */}
      <div>
        <label>Pickup Address:</label>
        <input
          type="text"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          placeholder="e.g. Innocentre, Hong Kong"
          style={{ display: 'block', width: '100%', marginBottom: '1rem' }}
        />
      </div>

      {/* Drop-off address input */}
      <div>
        <label>Drop-off Address:</label>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="e.g. Hong Kong International Airport Terminal 1"
          style={{ display: 'block', width: '100%', marginBottom: '1rem' }}
        />
      </div>

      {/* Display validation error if any */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit">Get Route</button>
    </form>
  )
}

export default AddressForm
