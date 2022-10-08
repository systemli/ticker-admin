import { latLng } from 'leaflet'
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

  return (
    <MapContainer center={position} scrollWheelZoom={false} zoom={7}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <GeoJSON data={JSON.parse(message.geo_information)} />
    </MapContainer>
  )
}

export default MessageMap
