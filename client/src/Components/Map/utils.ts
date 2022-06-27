
import { LatLngBounds } from 'leaflet'

export const toMapBounds = (b: LatLngBounds) => {
    const { lat: maxLat, lng: minLng } = b.getNorthWest()
    const { lat: minLat, lng: maxLng } = b.getSouthEast()
    return { minLat: minLat, maxLat: maxLat, minLng: minLng, maxLng: maxLng }
}