import React from "react";
import PropTypes from 'prop-types';
import { Map, Marker, Popup, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { Card } from 'semantic-ui-react';

export default class MessageMap extends React.Component {
    constructor(props) {
        super(props);
    }

    _onChange() {
        let geojson = this._editableFeatureGroup.leafletElement.toGeoJSON();
        // Clean up to submit an empty object instead of an empty feature collection
        if (geojson.features.length == 0) { geojson = {} }
        this.props.mapEditorChange(geojson)
    }

    _onFeatureGroupReady(featureGroupRef) {
        this._editableFeatureGroup = featureGroupRef;
    }

    render() {
        return (
            <Card.Content>
                <Map center={[0, 0]} zoom={1}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <FeatureGroup ref={ (featureGroupRef) => {this._onFeatureGroupReady(featureGroupRef)} }>
                        <EditControl
                            position='topright'
                            onEdited={this._onChange.bind(this)}
                            onCreated={this._onChange.bind(this)}
                            onDeleted={this._onChange.bind(this)}
                        />
                    </FeatureGroup>
                </Map>
            </Card.Content>
        );
    }
}

MessageMap.propTypes = {
};
