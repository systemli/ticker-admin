import React from 'react';
import {Button, Card, Container, Form, Header, Icon, Input, List, Modal} from "semantic-ui-react";
import {getInactiveSettings, putInactiveSettings} from "../api/Settings";
import ReactMarkdown from 'react-markdown';

class InactiveSettings extends React.Component {
    constructor(props) {
        super(props);

        this.form = {};

        this.state = {
            inactiveSettings: {},
            modalOpen: false,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        getInactiveSettings().then((response) => {
            if (response.data !== undefined && response.data.setting !== undefined) {
                this.setState({inactiveSettings: response.data.setting.value});
            }
        });
    }

    handleSubmit(event) {
        if (Object.keys(this.form).length > 0) {
            let formData = {...this.state.inactiveSettings, ...this.form};

            putInactiveSettings(formData).then((response) => {
                if (response.data !== undefined && response.data.setting !== undefined) {
                    this.setState({inactiveSettings: response.data.setting.value});
                }
            });
        }

        this.setState({modalOpen: false});
        event.preventDefault();
    }

    renderForm() {
        return (
            <Form onSubmit={this.handleSubmit} id='editSetting'>
                <Form.Group widths='equal'>
                    <Form.Input
                        label='Headline'
                        name='headline'
                        defaultValue={this.state.inactiveSettings.headline}
                        onChange={(event, input) => this.form.headline = input.value}
                    />
                    <Form.Input
                        label='Subheadline'
                        name='sub_headline'
                        defaultValue={this.state.inactiveSettings.sub_headline}
                        onChange={(event, input) => this.form.sub_headline = input.value}
                    />
                </Form.Group>
                <Form.TextArea
                    label='Description'
                    name='description'
                    rows='5'
                    defaultValue={this.state.inactiveSettings.description}
                    onChange={(event, input) => this.form.description = input.value}
                />
                <Header dividing>Information</Header>
                <Form.Group widths='equal'>
                    <Form.Input label='Author'>
                        <Input
                            iconPosition='left'
                            placeholder='Author' name='author'
                            defaultValue={this.state.inactiveSettings.author}
                            onChange={(event, input) => this.form.author = input.value}>
                            <Icon name='users'/>
                            <input/>
                        </Input>
                    </Form.Input>
                    <Form.Input label='Homepage'>
                        <Input
                            iconPosition='left'
                            name='homepage'
                            defaultValue={this.state.inactiveSettings.homepage}
                            onChange={(event, input) => this.form.homepage = input.value}>
                            <Icon name='home'/>
                            <input/>
                        </Input>
                    </Form.Input>
                </Form.Group>
                <Form.Group widths='equal'>
                    <Form.Input label='Email'>
                        <Input
                            iconPosition='left'
                            placeholder='Email' name='email'
                            defaultValue={this.state.inactiveSettings.email}
                            onChange={(event, input) => this.form.email = input.value}>
                            <Icon name='at'/>
                            <input/>
                        </Input>
                    </Form.Input>
                    <Form.Input label='Twitter'>
                        <Input
                            iconPosition='left'
                            name='twitter'
                            defaultValue={this.state.inactiveSettings.twitter}
                            onChange={(event, input) => this.form.twitter = input.value}>
                            <Icon name='twitter'/>
                            <input/>
                        </Input>
                    </Form.Input>
                </Form.Group>
            </Form>
        );
    }

    renderModal() {
        return (
            <Modal trigger={<Button color='black' icon='edit' content='edit'
                                    onClick={() => this.setState({modalOpen: true})}/>}
                   dimmer='blurring' open={this.state.modalOpen} closeIcon
                   onClose={() => this.setState({modalOpen: false})}
            >
                <Header>Edit Inactive Settings</Header>
                <Modal.Content>
                    {this.renderForm()}
                </Modal.Content>
                <Modal.Actions>
                    <Button.Group>
                        <Button type='submit' color='green' content='Save' form='editSetting'/>
                        <Button.Or/>
                        <Button color='red' content='Close' onClick={() => this.setState({modalOpen: false})}/>
                    </Button.Group>
                </Modal.Actions>
            </Modal>
        );

    }

    render() {
        return (
            <Container>
                <Card>
                    <Card.Content>
                        <Card.Header><Icon name='question circle'/>Inactive Settings</Card.Header>
                        <Card.Meta>These settings have affect for inactive or non-configured tickers.</Card.Meta>
                    </Card.Content>
                    <Card.Content>
                        <Card.Description>
                            <List>
                                <List.Item>
                                    <List.Header>Headline</List.Header>
                                    {this.state.inactiveSettings.headline}
                                </List.Item>
                                <List.Item>
                                    <List.Header>Subheadline</List.Header>
                                    {this.state.inactiveSettings.sub_headline}
                                </List.Item>
                                <List.Item>
                                    <List.Header>Description</List.Header>
                                    <ReactMarkdown source={this.state.inactiveSettings.description} />
                                </List.Item>
                            </List>
                            <Header size='medium'>Information</Header>
                            <List>
                                <List.Item>
                                    <List.Icon name='users'/>
                                    <List.Content>{this.state.inactiveSettings.author}</List.Content>
                                </List.Item>
                                <List.Item>
                                    <List.Icon name='mail'/>
                                    <List.Content>{this.state.inactiveSettings.email}</List.Content>
                                </List.Item>
                                <List.Item>
                                    <List.Icon name='linkify'/>
                                    <List.Content>{this.state.inactiveSettings.homepage}</List.Content>
                                </List.Item>
                                <List.Item>
                                    <List.Icon name='twitter'/>
                                    <List.Content>{this.state.inactiveSettings.twitter}</List.Content>
                                </List.Item>
                            </List>
                        </Card.Description>
                    </Card.Content>
                    <Card.Content>
                        {this.renderModal()}
                    </Card.Content>
                </Card>
            </Container>
        );
    }
}

export default InactiveSettings;
