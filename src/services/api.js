// Sends origin and destination to get a route token
export async function getRouteToken(origin, destination) {
    const url = 'https://sg-mock-api.lalamove.com/route'
  
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ origin, destination })
      })
  
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`)
      }
  
      const data = await res.json()
      return data.token
    } catch (err) {
      console.error('Error fetching token:', err)
      throw err
    }
}
  
// Polls the route status using the token until success, failure, or max retries
export const pollRouteStatus = async (token, maxRetries = 10, interval = 1000) => {
    let attempts = 0
  
    while (attempts < maxRetries) {
      try {
        const response = await fetch(`https://sg-mock-api.lalamove.com/route/${token}`)
  
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`)
        }
  
        const data = await response.json()
  
        if (data.status === 'in progress') {
          await new Promise(res => setTimeout(res, interval))
          attempts++
        } else if (data.status === 'failure') {
          throw new Error(data.error || 'Route failed')
        } else if (data.status === 'success') {
          return data
        }
      } catch (err) {
        throw err
      }
    }
  
    throw new Error('Max retries reached')
}
  