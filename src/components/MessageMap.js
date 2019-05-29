import React from "react";
import PropTypes from 'prop-types';
import { Map, Marker, Popup, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { Card } from 'semantic-ui-react';

export default class MessageMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const position = [53.505, -0.09];

        return (
            <Card.Content>
                <Map center={position} zoom={13}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    />
                    <Marker position={position}>
                        <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
                    </Marker>
                    <FeatureGroup>
                        <EditControl
                            position='topright'
                            onEdited={this._onEditPath}
                            onCreated={this._onCreate}
                            onDeleted={this._onDeleted}
                            draw={{
                                rectangle: false
                            }}
                        />
                    </FeatureGroup>
                </Map>
            </Card.Content>
        );
    }
}

MessageMap.propTypes = {
};
