import React from "react";
import {Card, Icon} from "semantic-ui-react";
import PropTypes from 'prop-types';

import Moment from "react-moment";
import {deleteMessage} from "../api/Message";

export default class Message extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.message.id,
            ticker: props.message.ticker,
            text: Message._replaceMagic(props.message.text),
            creationDate: props.message.creation_date,
            tweetId: props.message.tweet_id || null,
            tweetUser: props.message.tweet_user || null,
        };

        this._getText = this._getText.bind(this);
        this._deleteMessage = this._deleteMessage.bind(this);
    }

    static _replaceMagic(text) {
        return (text
            .replace(/(https?:\/\/([^\s]+))/g, '<a href="$1" target="_blank">$2</a>')
            .replace(/#(\S+)/g, '<a target="_blank" href="https://twitter.com/search?q=%23$1">#$1</a>')
            .replace(/@(\S+)/g, '<a target="_blank" href="https://twitter.com/$1">@$1</a>')
            .replace(/(?:\r\n|\r|\n)/g, '<br/>'));
    }

    _getText() {
        return (
            <p dangerouslySetInnerHTML={{__html: this.state.text}}/>
        );
    }

    _deleteMessage(event) {
        deleteMessage(this.state.ticker, this.state.id).then(() => {
            this.props.loadMessages()
        });

        event.preventDefault();
    }

    render() {
        let twitterIcon = (this.state.tweetId != null) ? (
            <a href={`https://twitter.com/${this.state.tweetUser}/status/${this.state.tweetId}`} target='_blank'><Icon
                name='twitter'/></a>) : (<Icon name='twitter' disabled/>);

        return (
            <Card fluid>
                <Card.Content>
                    <a onClick={this._deleteMessage}>
                        <Icon fitted link color='grey' name='close' style={{float: 'right'}}/>
                    </a>
                    {this._getText()}
                </Card.Content>
                <Card.Content extra>
                    {twitterIcon}
                    <Moment fromNow>{this.state.creationDate}</Moment>
                </Card.Content>
            </Card>
        );
    }
}

Message.propTypes = {
    message: PropTypes.shape({
        id: PropTypes.number.isRequired,
        ticker: PropTypes.object.isRequired,
        text: PropTypes.string.isRequired,
        creation_date: PropTypes.number.isRequired,
        tweet_id: PropTypes.string,
        tweet_user: PropTypes.string,
    }),
    loadMessages: PropTypes.func.isRequired,
};
