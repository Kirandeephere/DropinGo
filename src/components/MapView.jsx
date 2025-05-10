import React, { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const MapView = ({ waypoints }) => {
  const mapContainerRef = useRef(null)
  const map = useRef(null)

  // Helper: Fetch driving route with curved roads
  const fetchRoute = async (coords) => {
    const coordString = coords.map(([lat, lng]) => `${lng},${lat}`).join(';')
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordString}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`

    const res = await fetch(url)
    const data = await res.json()
    return data.routes?.[0]?.geometry
  }

  useEffect(() => {
    if (!mapboxgl.accessToken) {
      console.error('Mapbox access token is missing.')
      return
    }

    // Initialize map once
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [114.15769, 22.28552], // Default center: HK
        zoom: 11
      })
    }

    // Draw markers and route
    if (waypoints?.length) {
      map.current.once('load', async () => {
        // Clear old markers and route
        map.current?.getStyle().layers?.forEach(layer => {
          if (layer.id === 'route-line') {
            if (map.current.getLayer('route-line')) map.current.removeLayer('route-line')
            if (map.current.getSource('route')) map.current.removeSource('route')
          }
        })

        const bounds = new mapboxgl.LngLatBounds()

      waypoints.forEach(([lat, lng], idx) => {
        // Custom numbered marker
        const el = document.createElement('div')
        el.className = 'custom-marker'
        el.textContent = `${idx + 1}`

        // Smarter popup label
        const popupLabel = 
          idx === 0
            ? 'Origin'
            : idx === waypoints.length - 1
            ? 'Destination'
            : `Stop ${idx}`

        new mapboxgl.Marker(el)
          .setLngLat([lng, lat])
          .setPopup(new mapboxgl.Popup().setText(popupLabel))
          .addTo(map.current)

        bounds.extend([lng, lat])
      })

        // Fit bounds to all points
        map.current.fitBounds(bounds, { padding: 60 })

        // Draw the driving route
        const geometry = await fetchRoute(waypoints)
        if (geometry) {
          map.current.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry
            }
          })

          map.current.addLayer({
            id: 'route-line',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#3b82f6',
              'line-width': 4
            }
          })
        }
      })
    }

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [waypoints])

  return <div ref={mapContainerRef} className="map-container" />
}

export default MapView
