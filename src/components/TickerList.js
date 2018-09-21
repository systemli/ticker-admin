import React from "react";
import {deleteTicker, getTickers} from "../api/Ticker";
import {Button, Confirm, Container, Icon, Table} from "semantic-ui-react";
import withAuth from "./withAuth";
import PropTypes from "prop-types";
import TickerForm from "./TickerForm";
import Ticker from "../models/Ticker";

class TickerList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTicker: null,
            deleteTicker: null,
            deleteConfirmOpen: false,
            tickers: [],
        };

        this.loadTickers = this.loadTickers.bind(this);
        this.redirectToTicker = this.redirectToTicker.bind(this);
        this.editTicker = this.editTicker.bind(this);
        this.createTicker = this.createTicker.bind(this);
        this.deleteTicker = this.deleteTicker.bind(this);
        this.handleDeleteCancel = this.handleDeleteCancel.bind(this);
        this.handleDeleteConfirm = this.handleDeleteConfirm.bind(this);
        this.onEditClose = this.onEditClose.bind(this);
        this.renderTickerForm = this.renderTickerForm.bind(this);
    }

    componentDidMount() {
        this.loadTickers()
    }

    loadTickers() {
        getTickers().then(response => {
            this.setState({tickers: response.data.tickers});
        })
    }

    redirectToTicker(event, data) {
        this.props.history.replace(`/ticker/${data.ticker.id}`)
    }

    editTicker(event, data) {
        this.setState({activeTicker: data.ticker});
    }

    createTicker() {
        this.setState({activeTicker: new Ticker()})
    }

    deleteTicker(event, data) {
        this.setState({deleteTicker: data.ticker, deleteConfirmOpen: true})
    }

    handleDeleteCancel() {
        this.setState({deleteTicker: null, deleteConfirmOpen: false})
    }

    handleDeleteConfirm() {
        if (null === this.state.deleteTicker) {
            return;
        }

        deleteTicker(this.state.deleteTicker.id).then(() => {
            this.setState({deleteTicker: null, deleteConfirmOpen: false});

            this.loadTickers()
        })
    }

    onEditClose() {
        this.setState({activeTicker: null});

        this.loadTickers()
    }

    renderTickerForm() {
        if (null !== this.state.activeTicker) {
            return (
                <TickerForm ticker={this.state.activeTicker} callback={this.onEditClose}/>
            )
        }

        return null;
    }

    render() {
        const tickers = this.state.tickers;

        return (
            <Container>
                <Table celled striped>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell/>
                            <Table.HeaderCell>Title</Table.HeaderCell>
                            <Table.HeaderCell>Domain</Table.HeaderCell>
                            <Table.HeaderCell/>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {tickers.map(ticker => {
                                return (
                                    <Table.Row key={ticker.id}>
                                        <Table.Cell collapsing><Icon
                                            size={'large'}
                                            color={ticker.active ? 'green' : 'red'}
                                            name={ticker.active ? 'toggle on' : 'toggle off'}
                                        /></Table.Cell>
                                        <Table.Cell>{ticker.title}</Table.Cell>
                                        <Table.Cell>{ticker.domain}</Table.Cell>
                                        <Table.Cell collapsing textAlign='right'>
                                            <Button.Group size='small'>
                                                <Button ticker={ticker} color='teal' icon='rocket' content='Use'
                                                        onClick={this.redirectToTicker}/>
                                                <Button ticker={ticker} color='black' icon='edit' content='Edit'
                                                        onClick={this.editTicker}/>
                                                <Button ticker={ticker} color='red' icon='delete' content='Delete'
                                                        onClick={this.deleteTicker}/>
                                            </Button.Group>
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            }
                        )}
                    </Table.Body>
                </Table>
                <Button content={'Create'} icon={'plus'} color={'green'} onClick={this.createTicker}/>
                {this.renderTickerForm()}
                <Confirm
                    open={this.state.deleteConfirmOpen}
                    onCancel={this.handleDeleteCancel}
                    onConfirm={this.handleDeleteConfirm}/>
            </Container>
        );
    }
}

export default withAuth(TickerList);

TickerList.propTypes = {
    history: PropTypes.any.isRequired,
};
