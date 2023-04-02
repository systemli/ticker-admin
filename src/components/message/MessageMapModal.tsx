import React, { FC, useState } from 'react'
import L, { FeatureGroup as FG, latLng } from 'leaflet'
import { FeatureGroup, GeoJSON, MapContainer, TileLayer } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import { FeatureCollection, Geometry } from 'geojson'
import { Ticker } from '../../api/Ticker'
import { leafletOnDataAddFitToBounds } from '../../lib/leafletFitBoundsHelper'
import Modal from '../common/Modal'

interface Props {
  open: boolean
  onClose: () => void
  onChange: (features: FeatureCollection<Geometry, any>) => void
  map: FeatureCollection<Geometry, any>
  ticker: Ticker
}

const MessageMapModal: FC<Props> = ({
  open,
  onChange,
  onClose,
  map,
  ticker,
}) => {
  const [featureGroup, setFeatureGroup] = useState<FG>(new L.FeatureGroup())
  const position = latLng(ticker.location.lat, ticker.location.lon)
  const zoom = 7

  const onFeatureGroupUpdate = (ref: FG) => {
    if (ref !== null) {
      setFeatureGroup(ref)
    }
  }

  const handleChange = () => {
    const geoJSON = new L.GeoJSON(map)
    geoJSON.eachLayer(layer => featureGroup.addLayer(layer))
    // @ts-ignore
    onChange(featureGroup.toGeoJSON())
    onClose()
  }

  return (
    <Modal
      dialogContentSx={{ px: 0 }}
      fullWidth={true}
      onClose={onClose}
      onSubmitAction={handleChange}
      open={open}
      submitForm="inactiveSettingForm"
      title="Edit Map"
    >
      <MapContainer center={position} style={{ height: 600 }} zoom={zoom}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <GeoJSON
          data={map}
          eventHandlers={{
            add: leafletOnDataAddFitToBounds,
          }}
        />
        <FeatureGroup ref={onFeatureGroupUpdate}>
          <EditControl
            draw={{ circle: false, circlemarker: false }}
            edit={{ featureGroup: featureGroup }}
            position="topright"
          />
        </FeatureGroup>
      </MapContainer>
    </Modal>
  )
}

export default MessageMapModal
