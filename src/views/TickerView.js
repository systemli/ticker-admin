import React from "react";
import moment from "moment";
import {
    Button, Card, Container, Feed, Form, Grid,
    Header, Icon, Label, Loader, Message as Error, Sticky
} from "semantic-ui-react";
import {getTicker, putTickerTwitter} from "../api/Ticker";
import Ticker from "../components/Ticker";
import EditMapModal from "../components/EditMapModal";
import {getMessages, postMessage} from "../api/Message";
import Message from "../components/Message";
import withAuth from "../components/withAuth";
import Navigation from "./Navigation";
import TwitterLogin from 'react-twitter-auth';
import {ApiUrl} from "../api/Api";
import PropTypes from 'prop-types';
import TickerUserList from "../components/TickerUserList";
import TickerResetButton from "../components/TickerResetButton";

class TickerView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            counter: 0,
            counterColor: 'green',
            counterLimit: this.counterLimit,
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
            showEditMapModal: false,
            geoInformation: {},
        };

        this.counterLimit = 280;

        this._submitMessage = this._submitMessage.bind(this);
        this.loadMessages = this.loadMessages.bind(this);
        this.twitterConnect = this.twitterConnect.bind(this);
        this.twitterDisconnect = this.twitterDisconnect.bind(this);
        this.twitterToggle = this.twitterToggle.bind(this);
        this.updateTicker = this.updateTicker.bind(this);
        this.handleContextRef = this.handleContextRef.bind(this)
    }

    componentDidMount() {
        this._loadTicker();
    }

    handleContextRef(stickyContext) {
        this.setState({stickyContext})
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
                let counterLimit = this.counterLimit;
                if (response.data.ticker.prepend_time) {
                    // 'xx:xx ' that format needs 6 characters
                    counterLimit -= 'xx:xx '.length;
                }

                this.setState({
                    ticker: response.data.ticker,
                    isConfigurationLoading: false,
                    isTwitterConnected: twitter.connected,
                    counterLimit: counterLimit,
                });
            }
        });

        this.loadMessages();
    }

    updateTicker(ticker) {
        if (ticker !== undefined) {
            this.setState({ticker: ticker});
        }
    }

    _renderTicker() {
        if (this.state.ticker.id !== undefined) {
            return (
                <Ticker fluid ticker={this.state.ticker} callback={this.updateTicker} history={this.props.history}/>
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
                        <Card.Header>
                            <Icon color={twitter.active ? 'green' : 'red'}
                                  name={twitter.active ? 'toggle on' : 'toggle off'}
                            />
                            {twitter.name}
                        </Card.Header>
                        <Card.Meta>
                            <a target='_blank' rel='noopener noreferrer'
                               href={'https://twitter.com/' + twitter.screen_name}>@{twitter.screen_name}</a>
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
                        You're currently not connected with Twitter. New messages will not be published to your account.
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

        if (this.state.ticker.prepend_time) {
            this.setState({input: moment().format('HH:mm') + ' ' + this.state.input});
        }

        postMessage(this.state.id, this.state.input, this.state.geoInformation).then(response => {
            if (response.data !== undefined && response.data.message !== undefined) {
                this.loadMessages();
                this.setState({
                    input: '', counter: 0, counterColor: 'green', geoInformation: {},
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

    renderUsers() {
        if (null !== this.props.user && this.props.user.is_super_admin) {
            return (
                <React.Fragment>
                    <Header dividing>Users</Header>
                    <TickerUserList id={this.props.id}/>
                </React.Fragment>
            );
        }
    }

    renderDangerZone() {
        if (null !== this.props.user && this.props.user.is_super_admin) {
            return (
                <React.Fragment>
                    <Header dividing>Danger Zone</Header>
                    <TickerResetButton ticker={this.state.ticker} reset={this.reset.bind(this)}/>
                </React.Fragment>
            )
        }
    }

    reset(ticker) {
        this.setState({ticker: ticker, messages: []});
    }

    renderEditMapModal() {
        return (
            <EditMapModal
                geoInformation={this.state.geoInformation}
                key={this.state.messages.length} // force rerendering after message submitted
                open={this.state.showEditMapModal}
                onSubmit={(geoInformation) => this.setState({showEditMapModal: false, geoInformation: geoInformation})}
                onClose={() => this.setState({showEditMapModal: false})}
            />
        )
    }

    renderMessageForm() {
        const state = this.state;

        return (
            <Form error={state.formError}>
                <Form.Field>
                    {this.renderEditMapModal()}
                </Form.Field>
                <Form.Field style={{display: 'none'}}>
                    <Form.TextArea
                        rows='3'
                        value={JSON.stringify(state.geoInformation)}
                    />
                </Form.Field>
                <Form.Field>
                    <Form.TextArea
                        placeholder='Write a message' rows='5'
                        value={state.input}
                        onChange={this.handleInput.bind(this)}
                    />
                </Form.Field>
                <Error
                    error
                    icon='ban'
                    hidden={!state.formError}
                    header='Error'
                    content={state.formErrorMessage}
                />
                <Button
                    color='teal'
                    content='Send'
                    icon='send'
                    disabled={state.formError}
                    onClick={() => this._submitMessage()}
                />
                <Button
                    color='orange'
                    content={(this.state.geoInformation.type === 'FeatureCollection') ? 'Change Map' : 'Add Map'}
                    icon={(this.state.geoInformation.type === 'FeatureCollection') ? 'map' : 'map outline'}
                    toggle
                    onClick={() => this.setState({showEditMapModal: true})}
                />
                <Label
                    content={`${state.counter}/${state.counterLimit}`}
                    color={state.counterColor} style={{float: 'right'}}
                />
            </Form>
        );
    }

    render() {
        const {stickyContext} = this.state;

        return (
            <Container>
                <Navigation history={this.props.history} user={this.props.user}/>
                <Container className='app'>
                    <Loader active={this.state.isConfigurationLoading || this.state.isMessagesLoading} size='large'/>
                    <Grid columns={2}>
                        <Grid.Row>
                            <Grid.Column width={10}>
                                <div ref={this.handleContextRef}>
                                    <Header dividing>Messages</Header>
                                    {this.renderMessageForm()}
                                    {this._renderMessages()}
                                </div>
                            </Grid.Column>
                            <Grid.Column width={6}>
                                <Sticky context={stickyContext} offset={50}>
                                    <Header dividing>Configuration</Header>
                                    {this._renderTicker()}
                                    <Header dividing>Twitter</Header>
                                    {this._renderTwitter()}
                                    {this.renderUsers()}
                                    {this.renderDangerZone()}
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

TickerView.propTypes = {
    id: PropTypes.number.isRequired,
    history: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
};
