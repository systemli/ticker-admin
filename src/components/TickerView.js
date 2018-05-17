import React from "react";
import {Button, Container, Feed, Form, Grid, Loader, Message as Error, TextArea} from "semantic-ui-react";
import {getTicker} from "../api/Ticker";
import Ticker from "./Ticker";
import {getMessages, postMessage} from "../api/Message";
import Message from "./Message";

export default class TickerView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.id,
            ticker: {},
            messages: [],
            isConfigurationLoading: true,
            isMessagesLoading: true,
            showError: false,
            error: '',
            text: '',
        };

        this._submitMessage = this._submitMessage.bind(this);
        this.loadMessages = this.loadMessages.bind(this);
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
                                              onChange={(event, input) => this.setState({text: input.value})}/>
                                </Form.Field>
                                <Button type='submit' content='Send'/>
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
