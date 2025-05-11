import React, { useState, useRef } from 'react'
import { Autocomplete } from '@react-google-maps/api'

const AddressForm = ({ onSubmit }) => {
  const [error, setError] = useState('')

  const originRef = useRef(null)
  const destinationRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const origin = originRef.current?.value || ''
    const destination = destinationRef.current?.value || ''

    if (!origin.trim() || !destination.trim()) {
      setError('Both addresses are required.')
      return
    }

    setError('')
    onSubmit({ origin, destination })
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
      {/* Pickup address input with Google Autocomplete */}
      <div>
        <label>Pickup Address:</label>
        <Autocomplete>
          <input
            type="text"
            ref={originRef}
            placeholder="e.g. Innocentre, Hong Kong"
            style={{ display: 'block', width: '100%', marginBottom: '1rem' }}
          />
        </Autocomplete>
      </div>

      {/* Drop-off address input with Google Autocomplete */}
      <div>
        <label>Drop-off Address:</label>
        <Autocomplete>
          <input
            type="text"
            ref={destinationRef}
            placeholder="e.g. Hong Kong International Airport Terminal 1"
            style={{ display: 'block', width: '100%', marginBottom: '1rem' }}
          />
        </Autocomplete>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit">Get Route</button>
    </form>
  )
}

export default AddressForm
