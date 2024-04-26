import { LeafletEvent } from 'leaflet'

export const leafletOnDataAddFitToBounds = (event: LeafletEvent) => {
  const leafletLayer = event.target
  const features = Object.values(leafletLayer._layers)

  if (
    features.length === 1 &&
    // @ts-expect-error type is currently not defined
    features[0].feature.geometry.type === 'Point'
  ) {
    // @ts-expect-error type is currently not defined
    const coords = features[0].feature.geometry.coordinates
    leafletLayer._map.setView([coords[1], coords[0]], 13)
  } else if (features.length > 1) {
    leafletLayer._map.fitBounds(leafletLayer.getBounds())
  }
}
