import React, { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const MapView = ({ waypoints }) => {
  const mapContainerRef = useRef(null)
  const map = useRef(null)
  const currentPopup = useRef(null)  // Reference to store the current popup

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

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [114.15769, 22.28552],
        zoom: 12
      })
    }

    if (waypoints?.length) {
      map.current.once('load', async () => {
        // Clean up existing route if any
        if (map.current.getLayer('route-line')) {
          map.current.removeLayer('route-line')
        }
        if (map.current.getSource('route')) {
          map.current.removeSource('route')
        }

        // Remove existing markers (optional, if you manage them)
        document.querySelectorAll('.custom-marker').forEach(el => el.remove())

        // Add markers
        const bounds = new mapboxgl.LngLatBounds()

        waypoints.forEach(([lat, lng], idx) => {
          const el = document.createElement('div')
          el.className = 'custom-marker'
          el.textContent = `${idx + 1}`

          const marker = new mapboxgl.Marker(el)
            .setLngLat([lng, lat])
            .addTo(map.current)

          bounds.extend([lng, lat])

          // Show coordinates on hover
          marker.getElement().addEventListener('mouseenter', () => {
            if (currentPopup.current) {
              currentPopup.current.remove()  // Remove previous popup if any
            }

            // Ensure lng and lat are numbers
  const lngNumber = Number(lng);
  const latNumber = Number(lat);

            const popup = new mapboxgl.Popup({ 
              offset: 25,
              closeButton: false 
            })
              .setLngLat([lng, lat])
              .setHTML(`<p>Coordinates: ${lngNumber.toFixed(4)}, ${latNumber.toFixed(4)}</p>`)
              .addTo(map.current)

            currentPopup.current = popup  // Store the current popup reference
          })

          marker.getElement().addEventListener('mouseleave', () => {
            if (currentPopup.current) {
              currentPopup.current.remove()  // Remove the popup when mouse leaves
              currentPopup.current = null  // Reset the popup reference
            }
          })
        })

        map.current.fitBounds(bounds, { padding: 60 })

        // Fetch and animate route
        const geometry = await fetchRoute(waypoints)
        if (geometry) {
          const routeCoords = geometry.coordinates
          const animatedRoute = {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: []
            }
          }

          map.current.addSource('route', {
            type: 'geojson',
            data: animatedRoute
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

          // Animate line drawing
          let i = 0
          const drawSpeed = 15 // milliseconds between points

          const animateLine = () => {
            if (i < routeCoords.length) {
              animatedRoute.geometry.coordinates.push(routeCoords[i])
              map.current.getSource('route').setData(animatedRoute)
              i++
              setTimeout(animateLine, drawSpeed)
            }
          }

          animateLine()
        }
      })
    }

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [waypoints])

  return <div ref={mapContainerRef} className="map-container"/>
}

export default MapView
