import React from "react";
import {Button, Form, Header, Icon, Input, Message, Modal} from "semantic-ui-react";
import {postTicker, putTicker} from "../api/Ticker";
import PropTypes from 'prop-types';
import LocationSearch from "./LocationSearch";
import {Map, Marker, Popup, TileLayer} from "react-leaflet";
import {CommonUtils} from "../utils/common";

export default class TickerForm extends React.Component {
    constructor(props) {
        super(props);

        this.form = {
            information: {},
        };

        this.state = {
            ticker: props.ticker,
            location: {
                lat: parseFloat(props.ticker.location.lat),
                lon: parseFloat(props.ticker.location.lon),
            },
            modalOpen: true,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    handleSubmit() {
        if (Object.keys(this.form).length <= 0) {
            return
        }

        let formData = CommonUtils.mapValueArray(
            ['title', 'domain', 'description', 'active', 'prepend_time'],
            this.form,
            this.props.ticker
        );

        formData.information = CommonUtils.mapValueArray(
            ['author', 'url', 'twitter', 'facebook'],
            this.form.information,
            this.props.ticker.information
        );

        formData.location = CommonUtils.mapValueArray(
            ['lat', 'lon'],
            this.state.location,
            this.props.ticker.location
        );

        this.updateTicker(formData);
    }

    updateTicker(formData) {
        let response;
        if (null !== this.props.ticker.id) {
            response = putTicker(formData, this.props.ticker.id);
        } else {
            response = postTicker(formData);
        }

        response.then(response => {
            this.setState({ticker: response.data.ticker});

            this.closeModal();
        });
    }

    closeModal() {
        this.setState({modalOpen: false});

        if (undefined !== this.props.callback) {
            this.props.callback(this.state.ticker);
        }
    }

    resetLocation(e) {
        this.setState({location: {lat: 0.0, lon: 0.0}});

        e.preventDefault();
    }

    handleLocationResult(result) {
        this.setState({location: {lat: parseFloat(result.lat), lon: parseFloat(result.lon)}});
    }

    renderLocation() {
        let position = [52, 12];
        let zoom = 6;
        let marker = null;
        let resetDisabled = true;

        if (this.state.location.lat !== 0.0 && this.state.location.lon !== 0.0) {
            position = [this.state.location.lat, this.state.location.lon];
            zoom = 10;
            resetDisabled = false;
            marker = <Marker position={position}>
                <Popup>
                    <strong>Location</strong><br/>
                    Latitude: {this.state.location.lat}<br/>
                    Longitude: {this.state.location.lon}<br/>
                </Popup>
            </Marker>
        }

        return (
            <React.Fragment>
                <Header dividing>Location</Header>
                <Message info size='small'>
                    You can add a default location to the ticker. This will help you to have a pre selected
                    location when you add a map to a message.
                </Message>
                <Form.Group widths='equal'>
                    <Form.Field width='15'>
                        <LocationSearch fluid callback={this.handleLocationResult.bind(this)}/>
                    </Form.Field>
                    <Form.Field width='1'>
                        <Button icon color='red' onClick={this.resetLocation.bind(this)}
                                disabled={resetDisabled}>
                            <Icon name='delete'/>
                        </Button>
                    </Form.Field>
                </Form.Group>
                <Map center={position} zoom={zoom} style={{height: 200}}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                    {marker}
                </Map>
            </React.Fragment>
        );
    }

    render() {
        return (
            <Modal
                closeIcon
                open={this.state.modalOpen}
                onClose={this.closeModal}
            >
                <Header>{null === this.props.ticker.id ? 'Create Ticker' : 'Edit ' + this.props.ticker.title}</Header>
                <Modal.Content>
                    <Form onSubmit={this.handleSubmit} id='editTicker'>
                        <Form.Group widths='equal'>
                            <Form.Input
                                label='Title'
                                name='title'
                                defaultValue={this.props.ticker.title}
                                onChange={(event, input) => this.form.title = input.value}
                                required
                            />
                            <Form.Input
                                label='Domain'
                                name='domain'
                                defaultValue={this.props.ticker.domain}
                                onChange={(event, input) => this.form.domain = input.value}
                                required
                            />
                        </Form.Group>
                        <Form.Checkbox
                            toggle
                            label='Active'
                            name='active'
                            defaultChecked={this.props.ticker.active}
                            onChange={(event, input) => this.form.active = input.checked}
                        />
                        <Form.TextArea
                            label='Description'
                            name='description'
                            rows='5'
                            defaultValue={this.props.ticker.description}
                            onChange={(event, input) => this.form.description = input.value}
                            required
                        />
                        <Header dividing>Information</Header>
                        <Form.Group widths='equal'>
                            <Form.Input label='Author'>
                                <Input
                                    iconPosition='left'
                                    placeholder='Author' name='information.author'
                                    defaultValue={this.props.ticker.information.author}
                                    onChange={(event, input) => this.form.information.author = input.value}>
                                    <Icon name='users'/>
                                    <input/>
                                </Input>
                            </Form.Input>
                            <Form.Input label='Homepage'>
                                <Input
                                    iconPosition='left'
                                    name='information.url'
                                    defaultValue={this.props.ticker.information.url}
                                    onChange={(event, input) => this.form.information.url = input.value}>
                                    <Icon name='home'/>
                                    <input/>
                                </Input>
                            </Form.Input>
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Input label='Email'>
                                <Input
                                    iconPosition='left'
                                    placeholder='Email' name='information.email'
                                    defaultValue={this.props.ticker.information.email}
                                    onChange={(event, input) => this.form.information.email = input.value}>
                                    <Icon name='at'/>
                                    <input/>
                                </Input>
                            </Form.Input>
                            <Form.Input label='Twitter'>
                                <Input
                                    iconPosition='left'
                                    name='information.twitter'
                                    defaultValue={this.props.ticker.information.twitter}
                                    onChange={(event, input) => this.form.information.twitter = input.value}>
                                    <Icon name='twitter'/>
                                    <input/>
                                </Input>
                            </Form.Input>
                            <Form.Input label='Facebook'>
                                <Input
                                    iconPosition='left'
                                    name='information.facebook'
                                    defaultValue={this.props.ticker.information.facebook}
                                    onChange={(event, input) => this.form.information.facebook = input.value}>
                                    <Icon name='facebook'/>
                                    <input/>
                                </Input>
                            </Form.Input>
                        </Form.Group>
                        {this.renderLocation()}
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button.Group>
                        <Button type='submit' color='green' content={null === this.props.ticker.id ? 'Create' : 'Save'}
                                form='editTicker'/>
                        <Button.Or/>
                        <Button color='red' content='Close' onClick={this.closeModal}/>
                    </Button.Group>
                </Modal.Actions>
            </Modal>
        )
    }
}

TickerForm.propTypes = {
    ticker: PropTypes.object,
    callback: PropTypes.func,
};
