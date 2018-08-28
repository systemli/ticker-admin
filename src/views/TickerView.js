import React from "react";
import {
    Button,
    Card,
    Container,
    Feed,
    Form,
    Grid,
    Header,
    Icon, Image,
    Label,
    Loader,
    Message as Error, Sticky
} from "semantic-ui-react";
import {getTicker, putTickerTwitter} from "../api/Ticker";
import Ticker from "../components/Ticker";
import {getMessages, postMessage} from "../api/Message";
import Message from "../components/Message";
import withAuth from "../components/withAuth";
import Navigation from "./Navigation";
import TwitterLogin from 'react-twitter-auth';
import {ApiUrl} from "../api/Api";

class TickerView extends React.Component {
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
            isTwitterConnected: false,
            messages: [],
            showError: false,
            input: '',
            ticker: {},
        };

        this._submitMessage = this._submitMessage.bind(this);
        this.loadMessages = this.loadMessages.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.twitterConnect = this.twitterConnect.bind(this);
        this.twitterDisconnect = this.twitterDisconnect.bind(this);
        this.twitterToggle = this.twitterToggle.bind(this);
    }

    componentWillMount() {
        this._loadTicker();
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

    twitterConnect(response) {
        response.json().then((data) => {
            this.updateTwitter(true, data.access_token, data.access_secret);
        });
    }

    twitterDisconnect() {
        this.updateTwitter(false, '', '', true);
    }

    twitterToggle() {
        const twitter = this.state.ticker.twitter;
        this.updateTwitter(!twitter.active);
    }

    updateTwitter(active, token, secret, disconnect) {
        let formData = {
            "active": active,
            "disconnect": disconnect || false,
            "token": token || "",
            "secret": secret || "",
        };

        putTickerTwitter(formData, this.state.id).then((response) => {
            let twitter = response.data.ticker.twitter;

            this.setState({
                ticker: response.data.ticker,
                isConfigurationLoading: false,
                isTwitterConnected: twitter.connected,
            });
        });
    }

    _loadTicker() {
        getTicker(this.state.id).then((response) => {
            if (response.data !== undefined && response.data.ticker !== undefined) {

                let twitter = response.data.ticker.twitter;

                this.setState({
                    ticker: response.data.ticker,
                    isConfigurationLoading: false,
                    isTwitterConnected: twitter.connected,
                });
            }
        });

        this.loadMessages();
    }

    _renderTicker() {
        if (this.state.ticker.id !== undefined) {
            return (
                <Ticker fluid ticker={this.state.ticker}/>
            );
        }
    }

    _renderTwitter() {
        const loginUrl = `${ApiUrl}/admin/auth/twitter`;
        const requestTokenUrl = `${ApiUrl}/admin/auth/twitter/request_token?callback=${encodeURI(window.location.origin)}`;
        const twitter = this.state.ticker.twitter || {};

        let toggleButton;
        if (twitter.active) {
            toggleButton = <Button color='yellow' onClick={this.twitterToggle}>
                <Icon name='pause'/> Disable
            </Button>;
        } else {
            toggleButton = <Button color='green' onClick={this.twitterToggle}>
                <Icon name='play'/> Enable
            </Button>;
        }

        return (this.state.isTwitterConnected) ? (
            <Container>
                <Card fluid>
                    <Card.Content>
                        <Image floated='right' size='mini' src={twitter.image_url}/>
                        <Card.Header>
                            <Icon color={twitter.active ? 'green' : 'red'}
                                  name={twitter.active ? 'toggle on' : 'toggle off'}
                            />
                            {twitter.name}
                        </Card.Header>
                        <Card.Meta>
                            @{twitter.screen_name}
                        </Card.Meta>
                        <Card.Description>
                            {twitter.description}
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Button.Group fluid size='tiny' compact>
                            {toggleButton}
                            <Button color='red' onClick={this.twitterDisconnect}>
                                <Icon name='delete'/>Disconnect
                            </Button>
                        </Button.Group>
                    </Card.Content>
                </Card>
            </Container>
        ) : (
            <Container>
                <Card fluid>
                    <Card.Content>
                        You currently not connected with Twitter. This means new messages will not published to your
                        account.
                    </Card.Content>
                    <Card.Content extra>
                        <TwitterLogin
                            className='ui button blue tiny compact'
                            showIcon={false}
                            loginUrl={loginUrl}
                            requestTokenUrl={requestTokenUrl}
                            onFailure={(error) => {
                                alert(error);
                            }}
                            onSuccess={this.twitterConnect}
                        ><Icon name='twitter'/>Connect</TwitterLogin>
                    </Card.Content>
                </Card>
            </Container>
        );
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
                    input: '', counter: 0, counterColor: 'green'
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

    render() {
        return (
            <Container>
                <Navigation/>
                <Container className='app'>
                    <Loader active={this.state.isConfigurationLoading || this.state.isMessagesLoading} size='large'/>
                    <Grid columns={2}>
                        <Grid.Row>
                            <Grid.Column width={10}>
                                <Header dividing>Messages</Header>
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
                                    <Label content={`${this.state.counter}/${this.state.counterLimit}`}
                                           color={this.state.counterColor} style={{float: 'right'}}/>
                                </Form>
                                {this._renderMessages()}
                            </Grid.Column>
                            <Grid.Column width={6}>
                                <Sticky offset={50}>
                                    <Header dividing>Configuration</Header>
                                    {this._renderTicker()}
                                    <Header dividing>Twitter</Header>
                                    {this._renderTwitter()}
                                </Sticky>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </Container>
        );
    }
}

export default withAuth(TickerView);
