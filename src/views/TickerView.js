import React from "react";
import {
    Container, Feed, Grid,
    Header, Loader
} from "semantic-ui-react";
import {getTicker} from "../api/Ticker";
import Ticker from "../components/Ticker";
import {getMessages} from "../api/Message";
import Message from "../components/Message";
import withAuth from "../components/withAuth";
import Navigation from "./Navigation";
import PropTypes from 'prop-types';
import TickerUserList from "../components/TickerUserList";
import TickerResetButton from "../components/TickerResetButton";
import MessageForm from "../components/MessageForm";
import TwitterCard from "../components/TwitterCard";

class TickerView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.id,
            isConfigurationLoading: true,
            isMessagesLoading: true,
            messages: [],
            ticker: {},
        };

        this.loadMessages = this.loadMessages.bind(this);
        this.updateTicker = this.updateTicker.bind(this);
    }

    componentDidMount() {
        this._loadTicker();
    }

    _loadTicker() {
        getTicker(this.state.id).then((response) => {
            if (response.data !== undefined && response.data.ticker !== undefined) {
                this.setState({
                    ticker: response.data.ticker,
                    isConfigurationLoading: false,
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

    render() {
        return (
            <Container>
                <Navigation history={this.props.history} user={this.props.user}/>
                <Container className='app'>
                    <Loader active={this.state.isConfigurationLoading || this.state.isMessagesLoading} size='large'/>
                    <Grid columns={2}>
                        <Grid.Row>
                            <Grid.Column width={10}>
                                <Header dividing>Messages</Header>
                                <MessageForm ticker={this.state.ticker} callback={this.loadMessages}/>
                                {this._renderMessages()}
                            </Grid.Column>
                            <Grid.Column width={6}>
                                <Header dividing>Configuration</Header>
                                {this._renderTicker()}
                                <Header dividing>Twitter</Header>
                                <TwitterCard ticker={this.state.ticker}
                                             callback={(ticker) => this.setState({ticker: ticker})}/>
                                {this.renderUsers()}
                                {this.renderDangerZone()}
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
