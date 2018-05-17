import React from "react";
import {Button, Container, Feed, Form, Grid, Label, Loader, Message as Error} from "semantic-ui-react";
import {getTicker} from "../api/Ticker";
import Ticker from "./Ticker";
import {getMessages, postMessage} from "../api/Message";
import Message from "./Message";

export default class TickerView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            counter: 0,
            counterColor: 'green',
            counterLimit: 280,
            formError: false,
            formErrorMessage: '',
            id: props.id,
            isConfigurationLoading: true,
            isMessagesLoading: true,
            messages: [],
            showError: false,
            input: '',
            ticker: {},
        };

        this._submitMessage = this._submitMessage.bind(this);
        this.loadMessages = this.loadMessages.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    handleInput(event, input) {
        let color = 'green';
        let message = '';
        let error = false;

        //TODO: Calculate length for Twitter (cutting links to 20 characters)
        if (input.value.length > this.state.counterLimit) {
            color = 'red';
            message = `The message is too long. You must remove ${input.value.length - this.state.counterLimit} characters.`;
            error = true;
        } else if (input.value.length >= 260) {
            color = 'orange';
        } else if (input.value.length >= 220) {
            color = 'yellow';
        } else {
            color = 'green';
        }

        this.setState({
            input: input.value,
            counter: input.value.length,
            counterColor: color,
            formError: error,
            formErrorMessage: message,
        });
    }

    _loadTicker() {
        getTicker(this.state.id).then((response) => {
            if (response.data !== undefined && response.data.ticker !== undefined) {
                this.setState({ticker: response.data.ticker, isConfigurationLoading: false});
            }
        });

        this.loadMessages();
    }

    _renderTicker() {
        if (this.state.ticker.id !== undefined) {
            return (
                <Ticker ticker={this.state.ticker}/>
            );
        }
    }

    _renderMessages() {
        if (this.state.messages.length > 0) {
            return (
                <Feed>
                    {this.state.messages.map(message => <Message key={message.id} message={message}
                                                                 loadMessages={this.loadMessages}/>)}
                </Feed>
            );
        }
    }

    _submitMessage() {
        if (this.state.input.length === 0 || this.state.input.length > this.state.counterLimit) {
            return;
        }

        postMessage(this.state.id, this.state.input).then(response => {
            if (response.data !== undefined && response.data.message !== undefined) {
                this.loadMessages();
                this.setState({
                    input: '', counter: 0
                });
            }
        });


    }

    loadMessages() {
        getMessages(this.state.id).then((response) => {
            if (response.data !== undefined && response.data.messages !== undefined) {
                this.setState({messages: response.data.messages, isMessagesLoading: false});
            }
        });
    }

    componentWillMount() {
        this._loadTicker();
    }

    render() {
        return (
            <Container>
                <Grid columns={2}>
                    <Grid.Row>
                        <Grid.Column>
                            <h1>Messages</h1>
                            <Loader active={this.state.isMessagesLoading} size='large'/>
                            <Form onSubmit={this._submitMessage} error={this.state.formError}>
                                <Form.Field>
                                    <Form.TextArea
                                        placeholder='Write a message' rows='4'
                                        value={this.state.input}
                                        onChange={this.handleInput}/>
                                </Form.Field>
                                <Error
                                    error
                                    icon='ban'
                                    hidden={!this.state.formError}
                                    header='Error'
                                    content={this.state.formErrorMessage}
                                />
                                <Button color='teal' type='submit' content='Send' icon='send'
                                        disabled={this.state.formError}/>
                                <Label basic content={`${this.state.counter}/${this.state.counterLimit}`}
                                       color={this.state.counterColor} style={{float: 'right'}}/>
                            </Form>
                            {this._renderMessages()}
                        </Grid.Column>
                        <Grid.Column>
                            <h1>Configuration</h1>
                            <Loader active={this.state.isConfigurationLoading} size='large'/>
                            {this._renderTicker()}
                            <h1>Twitter</h1>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        );
    }
}
