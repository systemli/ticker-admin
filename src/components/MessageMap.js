import React from "react";
import PropTypes from 'prop-types';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { Card } from "semantic-ui-react";

export default class Clock extends React.Component {
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
                </Map>
            </Card.Content>
        );
    }
}

Clock.propTypes = {
};
