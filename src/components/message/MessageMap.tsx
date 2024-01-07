import { latLng } from 'leaflet'
import { FC } from 'react'
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet'
import { Message } from '../../api/Message'
import { Ticker } from '../../api/Ticker'
import { leafletOnDataAddFitToBounds } from '../../lib/leafletFitBoundsHelper'

interface Props {
  message: Message
  ticker: Ticker
}

const MessageMap: FC<Props> = ({ message, ticker }) => {
  const position = latLng(ticker.location.lat, ticker.location.lon)

  const hasGeoInformation = () => {
    const geoInformation = JSON.parse(message.geoInformation)

    if (typeof geoInformation.features === 'undefined') {
      return false
    }

    return geoInformation.features.length >= 1
  }

  if (!hasGeoInformation()) {
    return null
  }

  return (
    <MapContainer center={position} scrollWheelZoom={false} style={{ height: 300 }} zoom={7}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <GeoJSON
        data={JSON.parse(message.geoInformation)}
        eventHandlers={{
          add: leafletOnDataAddFitToBounds,
        }}
      />
    </MapContainer>
  )
}

export default MessageMap
