import React, { useState } from 'react'
import AddressForm from './components/AddressForm'
import { getRouteToken, pollRouteStatus } from './services/api'

const App = () => {
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [routeData, setRouteData] = useState(null)

  const handleFormSubmit = async ({ origin, destination }) => {
    setLoading(true)
    setError(null)
    setToken(null)
    setRouteData(null)
  
    try {
      // Step 1: Get token using origin and destination addresse
      const resultToken = await getRouteToken(origin, destination)
      setToken(resultToken)
  
      // Step 2: Poll the API using the token to get the final route result
      const route = await pollRouteStatus(resultToken)
      setRouteData(route)
      
      // Log the route data for debugging
      console.log('Route data:', route)
    } catch (err) {
      // Handle any errors from the API calls
      setError(err.message || 'Something went wrong')
    } finally {
      // Hide loading state regardless of success or failure
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>DropinGo - Pin It. Drop It. Go.</h1>
      <AddressForm onSubmit={handleFormSubmit} />

      {loading && <p>Loading token...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {token && <p><strong>Token:</strong> {token}</p>}
      {routeData && (
        <div>
          <h3>Route Info:</h3>
          <p><strong>Distance:</strong> {routeData.total_distance}</p>
          <p><strong>Time:</strong> {routeData.total_time}</p>
          <h4>Waypoints:</h4>
          <ol>
            {routeData.path.map(([lat, lng], idx) => (
              <li key={idx}>{lat}, {lng}</li>
            ))}
          </ol>
        </div>
      )}

    </div>
  )
}

export default App

