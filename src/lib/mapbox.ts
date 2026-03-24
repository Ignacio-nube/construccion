export const COORDENADAS_CORRALON = {
  lng: -65.2577,
  lat: -26.7936,
}

export async function geocodificarDireccion(
  direccion: string
): Promise<{ lng: number; lat: number } | null> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  if (!token) return null

  const query = encodeURIComponent(`${direccion}, Tucumán, Argentina`)
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${token}&country=AR&limit=1`

  try {
    const res = await fetch(url)
    const data = await res.json()
    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center
      return { lng, lat }
    }
  } catch {
    // silenciar error
  }
  return null
}

export async function calcularRuta(
  origen: { lng: number; lat: number },
  destino: { lng: number; lat: number }
): Promise<{ distanciaKm: number; duracionMin: number; geojson: unknown } | null> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  if (!token) return null

  const coords = `${origen.lng},${origen.lat};${destino.lng},${destino.lat}`
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?access_token=${token}&geometries=geojson`

  try {
    const res = await fetch(url)
    const data = await res.json()
    if (data.routes && data.routes.length > 0) {
      const ruta = data.routes[0]
      return {
        distanciaKm: Math.round(ruta.distance / 100) / 10,
        duracionMin: Math.round(ruta.duration / 60),
        geojson: ruta.geometry,
      }
    }
  } catch {
    // silenciar error
  }
  return null
}
