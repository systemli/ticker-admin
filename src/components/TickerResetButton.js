import React from "react";
import withAuth from "./withAuth";
import {Button, Icon, Modal} from "semantic-ui-react";
import {putTickerReset} from "../api/Ticker";
import PropTypes from "prop-types";

class TickerResetButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        }
    }

    open() {
        this.setState({open: true});
    }

    close() {
        this.setState({open: false});
    }

    reset() {
        putTickerReset(this.props.ticker.id).then(response => {
            if (response.data.ticker !== null) {
                this.props.reset(response.data.ticker)
            }
        });
        this.setState({open: false});
    }

    render() {
        return (
            <React.Fragment>
                <Button size='tiny' negative icon labelPosition='left' onClick={this.open.bind(this)}>
                    <Icon name='remove'/>
                    Reset
                </Button>
                <Modal size='mini' open={this.state.open} onClose={this.close}>
                    <Modal.Header>Reset Ticker</Modal.Header>
                    <Modal.Content>
                        <p><strong>Are you sure you want to reset the ticker?</strong></p>
                        <p>This will remove all messages, descriptions, the connection to twitter and disable the
                            ticker.</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button negative onClick={this.close.bind(this)}>No</Button>
                        <Button positive icon='checkmark' labelPosition='right' content='Yes'
                                onClick={this.reset.bind(this)}/>
                    </Modal.Actions>
                </Modal>
            </React.Fragment>
        );
    }
}

export default withAuth(TickerResetButton);

TickerResetButton.propTypes = {
    ticker: PropTypes.object.isRequired,
    reset: PropTypes.func.isRequired
};
