import React, { FC, useCallback, useState } from 'react'
import { Card, Icon, Image } from 'semantic-ui-react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import Moment from 'react-moment'
import { Message as MessageType } from '../api/Message'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'
import { replaceMagic } from '../lib/helper'
import MessageModalDelete from './MessageModalDelete'

interface Props {
  message: MessageType
}

const Message: FC<Props> = ({ message }) => {
  const [imageLightboxOpen, setImageLightboxOpen] = useState<boolean>(false)
  const [imageIndex, setImageIndex] = useState<number>(0)

  const openImageLightbox = useCallback(() => setImageLightboxOpen(true), [])
  const closeImageLightbox = useCallback(() => setImageLightboxOpen(false), [])

  const hasGeoInformation = () => {
    const geoInformation = JSON.parse(message.geo_information)

    if (typeof geoInformation.features === 'undefined') {
      return false
    }

    return geoInformation.features.length >= 1
  }

  // const onGeoInformationAdded = event => {
  //   const leafletLayer = event.target
  //   const features = Object.values(leafletLayer._layers)

  //   if (
  //     features.length === 1 &&
  //     features[0].feature.geometry.type === 'Point'
  //   ) {
  //     const coords = features[0].feature.geometry.coordinates
  //     leafletLayer._map.setView([coords[1], coords[0]], 13)
  //   } else {
  //     leafletLayer._map.fitBounds(leafletLayer.getBounds())
  //   }
  // }

  const renderMap = () => {
    if (!hasGeoInformation()) {
      return null
    }

    return (
      <MapContainer center={[0, 0]} zoom={1}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <GeoJSON
          data={JSON.parse(message.geo_information)}
          // onAdd={onGeoInformationAdded}
        />
      </MapContainer>
    )
  }

  const renderAttachments = () => {
    const attachments = message.attachments

    if (attachments === null || attachments.length === 0) {
      return null
    }

    const images = attachments.map((image, key) => (
      <Image
        key={key}
        onClick={() => {
          openImageLightbox()
          setImageIndex(key)
        }}
        rounded
        src={image.url}
        style={{ width: 200, height: 200, objectFit: 'cover' }}
      />
    ))
    const urls = attachments.map(image => image.url)

    return (
      <Card.Content align="center">
        {imageLightboxOpen && (
          <Lightbox
            mainSrc={urls[imageIndex]}
            nextSrc={urls[(imageIndex + 1) % urls.length]}
            onCloseRequest={closeImageLightbox}
            prevSrc={urls[(imageIndex + urls.length - 1) % urls.length]}
            onMoveNextRequest={() =>
              setImageIndex((imageIndex + 1) % urls.length)
            }
            onMovePrevRequest={() =>
              setImageIndex((imageIndex + urls.length - 1) % urls.length)
            }
          />
        )}
        <Image.Group size="medium">{images}</Image.Group>
      </Card.Content>
    )
  }

  const renderTwitterIcon = () => {
    if (message.tweet_id === '') {
      return <Icon disabled name="twitter" />
    }

    return (
      <a
        href={`https://twitter.com/${message.tweet_user}/status/${message.tweet_id}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        <Icon name="twitter" />
      </a>
    )
  }

  return (
    <Card fluid>
      <Card.Content>
        <MessageModalDelete
          message={message}
          trigger={
            <Icon
              color="grey"
              fitted
              link
              name="close"
              style={{ float: 'right' }}
            />
          }
        />
        <p
          dangerouslySetInnerHTML={{
            __html: replaceMagic(message.text),
          }}
        />
      </Card.Content>
      {renderAttachments()}
      {renderMap()}
      <Card.Content extra>
        {renderTwitterIcon()}
        <Moment fromNow>{message.creation_date}</Moment>
      </Card.Content>
    </Card>
  )
}

export default Message
