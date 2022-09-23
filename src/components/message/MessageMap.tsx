import { latLng, LeafletEvent } from 'leaflet'
import React, { FC } from 'react'
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet'
import { Message } from '../../api/Message'
import { Ticker } from '../../api/Ticker'

interface Props {
  message: Message
  ticker: Ticker
}

const MessageMap: FC<Props> = ({ message, ticker }) => {
  const position = latLng(ticker.location.lat, ticker.location.lon)

  const hasGeoInformation = () => {
    const geoInformation = JSON.parse(message.geo_information)

    if (typeof geoInformation.features === 'undefined') {
      return false
    }

    return geoInformation.features.length >= 1
  }

  if (!hasGeoInformation()) {
    return null
  }

  const handleDataAdd = (event: LeafletEvent) => {
    const leafletLayer = event.target
    const features = Object.values(leafletLayer._layers)

    if (
      features.length === 1 &&
      // type is currently not defined
      // @ts-ignore
      features[0].feature.geometry.type === 'Point'
    ) {
      // @ts-ignore
      const coords = features[0].feature.geometry.coordinates
      leafletLayer._map.setView([coords[1], coords[0]], 13)
    } else {
      leafletLayer._map.fitBounds(leafletLayer.getBounds())
    }
  }

  return (
    <MapContainer center={position} scrollWheelZoom={false} zoom={7}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <GeoJSON
        data={JSON.parse(message.geo_information)}
        eventHandlers={{
          add: handleDataAdd,
        }}
      />
    </MapContainer>
  )
}

export default MessageMap
