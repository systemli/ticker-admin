import React from "react";
import {Button, Form, Header, Icon, Input, Modal} from "semantic-ui-react";
import {postTicker, putTicker} from "../api/Ticker";
import PropTypes from 'prop-types';
import Ticker from "../models/Ticker";

export default class TickerForm extends React.Component {
    constructor(props) {
        super(props);

        this.form = {
            information: {},
        };

        this.state = {
            modalOpen: true,
            ticker: props.ticker,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    handleSubmit() {
        if (Object.keys(this.form).length > 0) {
            let formData = {
                title: this.form.title || this.state.ticker.title,
                domain: this.form.domain || this.state.ticker.domain,
                description: this.form.description || this.state.ticker.description,
                active: this.form.active !== undefined ? this.form.active : this.state.ticker.active,
                prepend_time: this.form.prepend_time !== undefined ? this.form.prepend_time : this.state.ticker.prepend_time,
                information: this.form.information || {
                    author: this.form.information.author || this.state.ticker.information.author,
                    url: this.form.information.url || this.state.ticker.information.url,
                    email: this.form.information.email || this.state.ticker.information.email,
                    twitter: this.form.information.twitter || this.state.ticker.information.twitter,
                    facebook: this.form.information.facebook || this.state.ticker.information.facebook,
                }
            };

            if (null !== this.state.ticker.id) {
                putTicker(formData, this.state.ticker.id).then(response => {
                    this.closeModal(response.data.ticker);
                });
            } else {
                postTicker(formData).then(response => {
                    this.closeModal(response.data.ticker);
                })
            }
        }
    }

    closeModal(ticker) {
        this.setState({modalOpen: false});

        if (undefined !== this.props.callback) {
            if (undefined !== ticker) {
                this.props.callback(ticker)
            } else {
                this.props.callback(this.state.ticker)
            }
        }
    }

    render() {
        return (
            <Modal dimmer='blurring' open={this.state.modalOpen} closeIcon
                   onClose={this.closeModal}
            >
                <Header>{null === this.state.ticker.id ? 'Create Ticker' : 'Edit ' + this.state.ticker.title}</Header>
                <Modal.Content>
                    <Form onSubmit={this.handleSubmit} id='editTicker'>
                        <Form.Group widths='equal'>
                            <Form.Input
                                label='Title'
                                name='title'
                                defaultValue={this.state.ticker.title}
                                onChange={(event, input) => this.form.title = input.value}
                                required
                            />
                            <Form.Input
                                label='Domain'
                                name='domain'
                                defaultValue={this.state.ticker.domain}
                                onChange={(event, input) => this.form.domain = input.value}
                                required
                            />
                        </Form.Group>
                        <Form.Checkbox
                            toggle
                            label='Active'
                            name='active'
                            defaultChecked={this.state.ticker.active}
                            onChange={(event, input) => this.form.active = input.checked}
                        />
                        <Form.Checkbox
                            toggle
                            label='Prepend the message timestamp'
                            name='Prepend the message timestamp'
                            defaultChecked={this.state.ticker.prepend_time}
                            onChange={(event, input) => this.form.prepend_time = input.checked}
                        />
                        <Form.TextArea
                            label='Description'
                            name='description'
                            rows='5'
                            defaultValue={this.state.ticker.description}
                            onChange={(event, input) => this.form.description = input.value}
                            required
                        />
                        <Header dividing>Information</Header>
                        <Form.Group widths='equal'>
                            <Form.Input label='Author'>
                                <Input
                                    iconPosition='left'
                                    placeholder='Author' name='information.author'
                                    defaultValue={this.state.ticker.information.author}
                                    onChange={(event, input) => this.form.information.author = input.value}>
                                    <Icon name='users'/>
                                    <input/>
                                </Input>
                            </Form.Input>
                            <Form.Input label='Homepage'>
                                <Input
                                    iconPosition='left'
                                    name='information.url'
                                    defaultValue={this.state.ticker.information.url}
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
                                    defaultValue={this.state.ticker.information.email}
                                    onChange={(event, input) => this.form.information.email = input.value}>
                                    <Icon name='at'/>
                                    <input/>
                                </Input>
                            </Form.Input>
                            <Form.Input label='Twitter'>
                                <Input
                                    iconPosition='left'
                                    name='information.twitter'
                                    defaultValue={this.state.ticker.information.twitter}
                                    onChange={(event, input) => this.form.information.twitter = input.value}>
                                    <Icon name='twitter'/>
                                    <input/>
                                </Input>
                            </Form.Input>
                            <Form.Input label='Facebook'>
                                <Input
                                    iconPosition='left'
                                    name='information.facebook'
                                    defaultValue={this.state.ticker.information.facebook}
                                    onChange={(event, input) => this.form.information.facebook = input.value}>
                                    <Icon name='facebook'/>
                                    <input/>
                                </Input>
                            </Form.Input>
                        </Form.Group>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button.Group>
                        <Button type='submit' color='green' content={null === this.state.ticker.id ? 'Create' : 'Save'}
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
    ticker: PropTypes.objectOf(Ticker).isRequired,
    callback: PropTypes.func,
};
