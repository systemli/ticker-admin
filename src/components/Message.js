import React from "react";
import {Card, Confirm, Icon} from "semantic-ui-react";
import {Map, TileLayer, GeoJSON} from 'react-leaflet';
import PropTypes from 'prop-types';
import Moment from "react-moment";
import {deleteMessage} from "../api/Message";

export default class Message extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showDeleteConfirm: false,
        };
    }

    _replaceMagic(text) {
        return (text
            .replace(/(https?:\/\/([^\s]+))/g, '<a href="$1" target="_blank">$2</a>')
            .replace(/#(\S+)/g, '<a target="_blank" rel="noopener noreferrer" href="https://twitter.com/search?q=%23$1">#$1</a>')
            .replace(/ @(\S+)/g, ' <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/$1">@$1</a>')
            .replace(/(\w+@\w+.\w+)/g, '<a href="mailto:$1">$1</a>')
            .replace(/(?:\r\n|\r|\n)/g, '<br/>'))
    }

    deleteMessage() {
        deleteMessage(this.props.message.ticker.toString(), this.props.message.id.toString()).then(() => {
            this.props.loadMessages();
        });
    }

    hasGeoInformation() {
        let geoInformation = JSON.parse(this.props.message.geo_information);

        if (typeof geoInformation.features === 'undefined') {
            return false;
        }

        return geoInformation.features.length >= 1;
    }

    onGeoInformationAdded(event) {
        const leafletLayer = event.target;
        const features = Object.values(leafletLayer._layers);

        if (features.length === 1 && features[0].feature.geometry.type === 'Point') {
            const coords = features[0].feature.geometry.coordinates;
            leafletLayer._map.setView([coords[1], coords[0]], 13);
        } else {
            leafletLayer._map.fitBounds(leafletLayer.getBounds());
        }
    }

    renderMap() {
        if (!this.hasGeoInformation()) {
            return null;
        }

        return (
            <Map center={[0, 0]} zoom={1}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <GeoJSON data={JSON.parse(this.props.message.geo_information)} onAdd={this.onGeoInformationAdded}/>
            </Map>
        );
    }

    renderTwitterIcon() {
        if (this.props.message.tweet_id != null) {
            return (
                <a
                    href={`https://twitter.com/${this.props.message.tweet_user}/status/${this.props.message.tweet_id}`}
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <Icon name='twitter'/>
                </a>
            );
        }

        return (<Icon name='twitter' disabled/>);
    }

    render() {
        return (
            <Card fluid>
                <Card.Content>
                    <Icon
                        fitted
                        link
                        color='grey'
                        name='close'
                        style={{float: 'right'}}
                        onClick={() => this.setState({showDeleteConfirm: true})}
                    />
                    <Confirm
                        onCancel={() => this.setState({showDeleteConfirm: false})}
                        onConfirm={() => this.deleteMessage()}
                        open={this.state.showDeleteConfirm}
                    />
                    <p dangerouslySetInnerHTML={{__html: this._replaceMagic(this.props.message.text)}}/>
                </Card.Content>
                {this.renderMap()}
                <Card.Content extra>
                    {this.renderTwitterIcon()}
                    <Moment fromNow>{this.props.message.creation_date}</Moment>
                </Card.Content>
            </Card>
        );
    }
}

Message.propTypes = {
    message: PropTypes.shape({
        id: PropTypes.number.isRequired,
        ticker: PropTypes.number.isRequired,
        text: PropTypes.string.isRequired,
        creation_date: PropTypes.string.isRequired,
        tweet_id: PropTypes.string,
        tweet_user: PropTypes.string,
        geo_information: PropTypes.string,
    }),
    loadMessages: PropTypes.func.isRequired,
};
