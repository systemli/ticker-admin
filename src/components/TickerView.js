import React from "react";
import {Button, Container, Feed, Form, Grid, Label, Loader, Message as Error, TextArea} from "semantic-ui-react";
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
            error: false,
            errorMessage: '',
            id: props.id,
            isConfigurationLoading: true,
            isMessagesLoading: true,
            limit: 280,
            messages: [],
            showError: false,
            text: '',
            ticker: {},
        };

        this._submitMessage = this._submitMessage.bind(this);
        this.loadMessages = this.loadMessages.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    handleInput(event, input) {
        let color = 'green';

        //TODO: Calculate length for Twitter (cutting links to 20 characters)
        if (input.value.length >= 280) {
            color = 'red';
        } else if (input.value.length >= 260) {
            color = 'orange';
        } else if (input.value.length >= 220) {
            color = 'yellow';
        } else {
            color = 'green';
        }

        this.setState({
            text: input.value,
            counter: input.value.length,
            counterColor: color,
        });
    }

    _loadTicker() {
        getTicker(this.state.id).then((response) => {
            if (response.data !== undefined && response.data.ticker !== undefined) {
                this.setState({ticker: response.data.ticker, isConfigurationLoading: false});
            } else {
                this._showError(response.error.message, response.error.code);
            }
        });

        this.loadMessages();
    }

    _showError(message, code) {
        this.setState({
            error: `${message} (${code})`,
            showError: true,
            isConfigurationLoading: false,
        });
    }

    _renderTicker() {
        if (this.state.ticker.id !== undefined) {
            return (<Ticker ticker={this.state.ticker}/>);
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
        if (this.state.text.length === 0) {
            return;
        }

        postMessage(this.state.id, this.state.text).then(response => {
            if (response.data !== undefined && response.data.message !== undefined) {
                this.loadMessages();
            }
        });


    }

    loadMessages() {
        getMessages(this.state.id).then((response) => {
            if (response.data !== undefined && response.data.messages !== undefined) {
                this.setState({messages: response.data.messages, isMessagesLoading: false});
            } else {
                this._showError(response.error.message, response.error.code);
            }
        });
    }

    componentWillMount() {
        this._loadTicker();
    }

    render() {
        return (<div>
            <Error negative hidden={!this.state.showError}>
                <Error.Header>An Error occurred</Error.Header>
                <p>{this.state.error}</p>
            </Error>
            <Container>
                <Grid columns={2}>
                    <Grid.Row>
                        <Grid.Column>
                            <h1>Messages</h1>
                            <Loader active={this.state.isMessagesLoading} size='large'/>
                            <Form onSubmit={this._submitMessage}>
                                <Form.Field>
                                    <TextArea placeholder='Write a message'
                                              onChange={this.handleInput}/>
                                </Form.Field>
                                <Button color='teal' type='submit' content='Send'/>
                                <Label basic content={`${this.state.counter}/${this.state.limit}`} color={this.state.counterColor} style={{float: 'right'}}/>
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
        </div>);
    }
}
