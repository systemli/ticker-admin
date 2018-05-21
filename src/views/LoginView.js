import React from "react";
import {Button, Container, Form, Grid, Header, Icon, Input, Message} from "semantic-ui-react";
import AuthService from "../components/AuthService";
import Navigation from "./Navigation";

export default class LoginView extends React.Component {
    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.Auth = new AuthService();

        this.state = {
            showError: false,
        }
    }

    componentWillMount() {
        if (this.Auth.loggedIn())
            this.props.history.replace('/');
    }

    handleChange(event) {
        this.setState(
            {
                [event.target.name]: event.target.value
            }
        )
    }

    handleFormSubmit(e) {
        e.preventDefault();

        this.Auth.login(this.state.email, this.state.password)
            .then(() => {
                this.props.history.replace('/');
            })
            .catch(() => {
                this.setState({showError: true});
            });
    }

    renderError() {
        if (this.state.showError) {
            return (
                <Message negative>
                    <Message.Header>Error</Message.Header>
                    <p>Wrong credentials</p>
                </Message>
            );
        }

    }

    render() {
        return (
            <Container>
                <Navigation/>
                <Container className='app'>
                    <Grid centered>
                        <Grid.Column computer={6} mobile={16}>
                            <Grid.Row>
                                <Header size='huge' icon textAlign='center'>
                                    <Icon name='browser' size='small'/>
                                    <Header.Content>
                                        Login
                                    </Header.Content>
                                </Header>
                            </Grid.Row>
                            <Grid.Row>
                                <Form onSubmit={this.handleFormSubmit}>
                                    {this.renderError()}
                                    <Form.Input>
                                        <Input
                                            required
                                            icon='user'
                                            iconPosition='left'
                                            name='email'
                                            type='text'
                                            placeholder='Email'
                                            onChange={this.handleChange}>
                                        </Input>
                                    </Form.Input>
                                    <Form.Input>
                                        <Input
                                            required
                                            icon='lock'
                                            iconPosition='left'
                                            name='password'
                                            type='password'
                                            placeholder='Password'
                                            onChange={this.handleChange}>
                                        </Input>
                                    </Form.Input>
                                    <Button color='teal' type='submit' fluid>Login</Button>
                                </Form>
                            </Grid.Row>
                        </Grid.Column>
                    </Grid>
                </Container>
            </Container>
        );
    }
}
