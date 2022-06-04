import React from 'react'
import PropTypes from 'prop-types'
import { Map, TileLayer, FeatureGroup } from 'react-leaflet'
import L from 'leaflet'
import { EditControl } from 'react-leaflet-draw'
import { Button, Modal } from 'semantic-ui-react'

export default class EditMapModal extends React.Component {
  constructor(props) {
    super(props)
  }

  onClose() {
    this.props.onClose()
  }

  onSubmit() {
    this.props.onSubmit(this.toGeoJSON())
  }

  onFeatureGroupUpdated(ref) {
    if (ref === null) {
      return
    }

    this._editableFeatureGroup = ref

    if (this.props.geoInformation.type === 'FeatureCollection') {
      let geoJSON = new L.GeoJSON(this.props.geoInformation)
      let featureGroup = this._editableFeatureGroup.leafletElement

      geoJSON.eachLayer(layer => featureGroup.addLayer(layer))
    }
  }

  toGeoJSON() {
    let geojson = this._editableFeatureGroup.leafletElement.toGeoJSON()
    // Clean up to submit an empty object instead of an empty feature collection
    if (geojson.features.length === 0) {
      geojson = {}
    }

    return geojson
  }

  renderHeadline() {
    if (this.props.geoInformation.type === 'FeatureCollection') {
      return 'Change Map'
    }

    return 'Add Map'
  }

  render() {
    let position = [51, 12]
    let zoom = 6

    if (this.props.position[0] !== 0 && this.props.position[1] !== 0) {
      position = this.props.position
      zoom = 12
    }

    return (
      <Modal
        closeIcon
        dimmer
        open={this.props.open}
        onClose={this.onClose.bind(this)}
      >
        <Modal.Header>{this.renderHeadline()}</Modal.Header>
        <Modal.Content style={{ padding: 0 }}>
          <Map center={position} zoom={zoom} style={{ height: 600 }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <FeatureGroup
              ref={ref => {
                this.onFeatureGroupUpdated(ref)
              }}
            >
              <EditControl
                position="topright"
                //TODO: repair this broken marker types
                draw={{ circle: false, circlemarker: false }}
              />
            </FeatureGroup>
          </Map>
        </Modal.Content>
        <Modal.Actions>
          <Button.Group>
            <Button
              color="green"
              content="Save"
              onClick={this.onSubmit.bind(this)}
            />
            <Button.Or />
            <Button
              color="red"
              content="Close"
              onClick={this.onClose.bind(this)}
            />
          </Button.Group>
        </Modal.Actions>
      </Modal>
    )
  }
}

EditMapModal.propTypes = {
  geoInformation: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  position: PropTypes.array.isRequired,
}
