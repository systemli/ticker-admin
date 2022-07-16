import React, { FC, useCallback, useState } from 'react'
import L, { FeatureGroup as FG, latLng } from 'leaflet'
import { FeatureGroup, GeoJSON, MapContainer, TileLayer } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import { Button, Modal } from 'semantic-ui-react'
import { FeatureCollection, Geometry } from 'geojson'
import { Ticker } from '../api/Ticker'

interface Props {
  callback: (features: FeatureCollection<Geometry, any>) => void
  map: FeatureCollection<Geometry, any>
  ticker: Ticker
  trigger: React.ReactElement
}

const MessageMapModal: FC<Props> = props => {
  const [open, setOpen] = useState<boolean>(false)
  const [featureGroup, setFeatureGroup] = useState<FG>(new L.FeatureGroup())
  const position = latLng(props.ticker.location.lat, props.ticker.location.lon)
  const zoom = 7

  const onClose = useCallback(() => {
    setOpen(false)
  }, [])

  const onOpen = useCallback(() => {
    setOpen(true)
  }, [])

  const onFeatureGroupUpdate = useCallback((ref: FG) => {
    if (ref !== null) {
      setFeatureGroup(ref)
    }
  }, [])

  const onSubmit = useCallback(() => {
    const geoJSON = new L.GeoJSON(props.map)
    geoJSON.eachLayer(layer => featureGroup.addLayer(layer))
    // @ts-ignore
    props.callback(featureGroup.toGeoJSON())
    setOpen(false)
  }, [featureGroup, props])

  return (
    <Modal
      closeIcon
      dimmer
      onClose={onClose}
      onOpen={onOpen}
      open={open}
      trigger={props.trigger}
    >
      <Modal.Header>Add Map</Modal.Header>
      <Modal.Content style={{ padding: 0 }}>
        <MapContainer center={position} style={{ height: 600 }} zoom={zoom}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <GeoJSON data={props.map} />
          <FeatureGroup ref={onFeatureGroupUpdate}>
            <EditControl
              draw={{ circle: false, circlemarker: false }}
              edit={{ featureGroup: featureGroup }}
              position="topright"
            />
          </FeatureGroup>
        </MapContainer>
      </Modal.Content>
      <Modal.Actions>
        <Button.Group>
          <Button
            color="green"
            content="Save"
            onClick={onSubmit}
            type="button"
          />
          <Button.Or />
          <Button color="red" content="Close" onClick={onClose} type="button" />
        </Button.Group>
      </Modal.Actions>
    </Modal>
  )
}

export default MessageMapModal
