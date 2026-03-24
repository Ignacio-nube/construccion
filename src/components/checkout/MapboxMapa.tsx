'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { COORDENADAS_CORRALON } from '@/lib/mapbox'

interface MapboxMapaProps {
  coordsCliente?: { lng: number; lat: number } | null
  rutaGeojson?: unknown
  distanciaKm?: number
  duracionMin?: number
  onCoordsChange?: (coords: { lng: number; lat: number }) => void
  interactivo?: boolean
}

export default function MapboxMapa({
  coordsCliente,
  rutaGeojson,
  distanciaKm,
  duracionMin,
  onCoordsChange,
  interactivo = false,
}: MapboxMapaProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markerClienteRef = useRef<mapboxgl.Marker | null>(null)
  const onCoordsChangeRef = useRef(onCoordsChange)
  onCoordsChangeRef.current = onCoordsChange
  const [instruccionVisible, setInstruccionVisible] = useState(false)

  // Auto-ocultar instrucción a los 3.5s
  useEffect(() => {
    if (!interactivo) return
    setInstruccionVisible(true)
  }, [interactivo])

  useEffect(() => {
    if (!mapContainer.current) return
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token) return

    mapboxgl.accessToken = token

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [COORDENADAS_CORRALON.lng, COORDENADAS_CORRALON.lat],
      zoom: 13,
    })

    mapRef.current = map

    // Marcador corralón — pin naranja
    const elA = document.createElement('div')
    elA.style.cssText = `
      width: 24px; height: 24px;
      background: #E8500A;
      border: 3px solid #fff;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 2px 8px rgba(232,80,10,0.6);
    `
    new mapboxgl.Marker({ element: elA })
      .setLngLat([COORDENADAS_CORRALON.lng, COORDENADAS_CORRALON.lat])
      .setPopup(new mapboxgl.Popup({ className: 'mapbox-popup-dark' }).setText('Corralón Don Fierro'))
      .addTo(map)

    if (interactivo) {
      map.getCanvas().style.cursor = 'crosshair'
      map.on('click', (e) => {
        onCoordsChangeRef.current?.({ lng: e.lngLat.lng, lat: e.lngLat.lat })
        setInstruccionVisible(false)
      })
    }

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [interactivo])

  // Marcador cliente + ruta
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    if (markerClienteRef.current) {
      markerClienteRef.current.remove()
      markerClienteRef.current = null
    }

    if (coordsCliente) {
      const elB = document.createElement('div')
      elB.className = 'marcador-pulse'
      elB.style.cssText = `
        width: 20px; height: 20px;
        background: #E8500A;
        border: 3px solid #fff;
        border-radius: 50%;
        cursor: ${interactivo ? 'grab' : 'default'};
      `
      markerClienteRef.current = new mapboxgl.Marker({ element: elB, draggable: interactivo })
        .setLngLat([coordsCliente.lng, coordsCliente.lat])
        .setPopup(new mapboxgl.Popup().setText('Tu dirección'))
        .addTo(map)

      if (interactivo && markerClienteRef.current) {
        markerClienteRef.current.on('dragend', () => {
          const ll = markerClienteRef.current!.getLngLat()
          onCoordsChangeRef.current?.({ lng: ll.lng, lat: ll.lat })
        })
      }

      map.fitBounds(
        [
          [Math.min(COORDENADAS_CORRALON.lng, coordsCliente.lng) - 0.01, Math.min(COORDENADAS_CORRALON.lat, coordsCliente.lat) - 0.01],
          [Math.max(COORDENADAS_CORRALON.lng, coordsCliente.lng) + 0.01, Math.max(COORDENADAS_CORRALON.lat, coordsCliente.lat) + 0.01],
        ],
        { padding: 40 }
      )
    }

    if (map.isStyleLoaded()) {
      if (map.getLayer('ruta')) map.removeLayer('ruta')
      if (map.getSource('ruta')) map.removeSource('ruta')

      if (rutaGeojson && coordsCliente) {
        map.addSource('ruta', {
          type: 'geojson',
          data: { type: 'Feature', geometry: rutaGeojson as GeoJSON.Geometry, properties: {} },
        })
        map.addLayer({
          id: 'ruta',
          type: 'line',
          source: 'ruta',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: { 'line-color': '#E8500A', 'line-width': 3 },
        })
      }
    }
  }, [coordsCliente, rutaGeojson, interactivo])

  const duracionFormateada = duracionMin
    ? duracionMin >= 60
      ? `~${Math.floor(duracionMin / 60)}h ${duracionMin % 60}min`
      : `~${duracionMin} min`
    : null

  return (
    <div>
      {/* Contenedor mapa */}
      <div className="relative rounded-xl overflow-hidden border border-white/10" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }}>
        {/* Instrucción flotante */}
        {interactivo && instruccionVisible && !coordsCliente && (
          <div className="instruccion-toast absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-[rgba(26,26,26,0.85)] backdrop-blur-sm text-white text-xs font-body px-4 py-2 rounded-full pointer-events-none whitespace-nowrap">
            Tocá el mapa para marcar tu ubicación
          </div>
        )}
        <div ref={mapContainer} className="h-72 w-full" />
      </div>

      {/* Badge distancia — debajo del mapa */}
      {distanciaKm && duracionFormateada && (
        <div className="flex items-center gap-3 mt-3">
          <span className="inline-flex items-center gap-1.5 bg-[#1a1a1a] text-white text-xs font-body font-medium px-4 py-1.5 rounded-full">
            📍 <span>{distanciaKm} km</span>
          </span>
          <span className="inline-flex items-center gap-1.5 bg-[#1a1a1a] text-white text-xs font-body font-medium px-4 py-1.5 rounded-full">
            ⏱ <span>{duracionFormateada}</span>
          </span>
        </div>
      )}
    </div>
  )
}
