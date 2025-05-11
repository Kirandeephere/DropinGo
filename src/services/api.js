// Sends origin and destination to get a route token
export async function getRouteToken(origin, destination, signal) {
  const url = 'https://sg-mock-api.lalamove.com/route';

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ origin, destination }),
      signal, // Pass the signal to the fetch request
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const data = await res.json();
    return data.token;
  } catch (err) {
    // Check if the error is due to cancellation
    if (err.name === 'AbortError') {
      console.log('Request was canceled');
    } else {
      console.error('Error fetching token:', err);
    }
    throw err; // Rethrow the error (whether it is a cancellation or other error)
  }
}

// Polls the route status using the token until success, failure, or max retries
export const pollRouteStatus = async (token, signal, maxRetries = 5, interval = 1000) => {
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      const response = await fetch(`https://sg-mock-api.lalamove.com/route/${token}`, {
        signal, // Pass the signal to the fetch request
      });

      if (!response.ok) {
        if (response.status === 500) {
          throw new Error("Server error. Please try again later.");
        }
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'in progress') {
        // If the request is still in progress, wait for the specified interval
        await new Promise(res => setTimeout(res, interval));

        // Increment attempts and continue polling unless canceled
        attempts++;
      } else if (data.status === 'failure') {
        throw new Error(data.error || 'Route failed');
      } else if (data.status === 'success') {
        return data; // Successfully received the route
      }
    } catch (err) {
      // Handle the cancellation error separately
      if (err.name === 'AbortError') {
        console.log('Polling was canceled');
      }
      throw err;
    }
  }

  throw new Error('Max retries reached');
};
