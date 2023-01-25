import React, { FC, useState } from 'react'
import L, { FeatureGroup as FG, latLng } from 'leaflet'
import { FeatureGroup, GeoJSON, MapContainer, TileLayer } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import { FeatureCollection, Geometry } from 'geojson'
import { Ticker } from '../../api/Ticker'
import { leafletOnDataAddFitToBounds } from '../../lib/leafletFitBoundsHelper'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from '@mui/material'
import { Close } from '@mui/icons-material'

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

  const handleClose = () => {
    onClose()
  }

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
    <Dialog fullWidth maxWidth="md" open={open}>
      <DialogTitle>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
        >
          Edit Map
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ px: 0 }}>
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
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          form="inactiveSettingForm"
          onClick={handleChange}
          type="submit"
          variant="contained"
        >
          Save
        </Button>
        <Button color="secondary" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default MessageMapModal
