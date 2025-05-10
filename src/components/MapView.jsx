import React, { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const MapView = ({ waypoints }) => {
  const mapContainerRef = useRef(null)
  const map = useRef(null)

  useEffect(() => {
    if (!mapboxgl.accessToken) {
      console.error('Mapbox access token is missing.')
      return
    }

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [114.15769, 22.28552], // Default center: HK
        zoom: 11
      })
    }

    if (waypoints?.length) {
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

      map.current.fitBounds(bounds, { padding: 60 })
    }

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [waypoints])

  return <div ref={mapContainerRef} className="map-container" />
}

export default MapView
