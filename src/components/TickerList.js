import React from 'react'
import { deleteTicker, getTickers } from '../api/Ticker'
import { Button, Confirm, Icon, Message, Table } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import TickerForm from './TickerForm'
import Ticker from '../models/Ticker'

export default class TickerList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeTicker: null,
      deleteTicker: null,
      deleteConfirmOpen: false,
      tickers: [],
      user: props.user,
    }

    this.loadTickers = this.loadTickers.bind(this)
    this.editTicker = this.editTicker.bind(this)
    this.createTicker = this.createTicker.bind(this)
    this.deleteTicker = this.deleteTicker.bind(this)
    this.handleDeleteCancel = this.handleDeleteCancel.bind(this)
    this.handleDeleteConfirm = this.handleDeleteConfirm.bind(this)
    this.onEditClose = this.onEditClose.bind(this)
    this.renderTickerForm = this.renderTickerForm.bind(this)
  }

  componentDidMount() {
    this.loadTickers()
  }

  loadTickers() {
    getTickers().then(response => {
      this.setState({ tickers: response.data.tickers })
    })
  }

  redirectToTicker(event, data) {
    this.props.history.push(`/ticker/${data.ticker.id}`)
  }

  editTicker(event, data) {
    this.setState({ activeTicker: data.ticker })
  }

  createTicker() {
    this.setState({ activeTicker: new Ticker() })
  }

  deleteTicker(event, data) {
    this.setState({ deleteTicker: data.ticker, deleteConfirmOpen: true })
  }

  handleDeleteCancel() {
    this.setState({ deleteTicker: null, deleteConfirmOpen: false })
  }

  handleDeleteConfirm() {
    if (null === this.state.deleteTicker) {
      return
    }

    deleteTicker(this.state.deleteTicker.id).then(() => {
      this.setState({ deleteTicker: null, deleteConfirmOpen: false })

      this.loadTickers()
    })
  }

  onEditClose() {
    this.setState({ activeTicker: null })

    this.loadTickers()
  }

  renderTickerForm() {
    if (null !== this.state.activeTicker) {
      return (
        <TickerForm
          callback={this.onEditClose}
          ticker={this.state.activeTicker}
        />
      )
    }

    return null
  }

  renderCreateButton() {
    if (!this.state.user.is_super_admin) {
      return null
    }

    return (
      <Button
        color="green"
        content="Create Ticker"
        floated="right"
        icon="plus"
        labelPosition="left"
        onClick={this.createTicker}
        size="small"
      />
    )
  }

  renderDeleteButton(ticker) {
    if (!this.state.user.is_super_admin) {
      return null
    }

    return (
      <Button
        color="red"
        content="Delete"
        icon="delete"
        onClick={this.deleteTicker}
        ticker={ticker}
      />
    )
  }

  renderList(tickers) {
    return tickers.map(ticker => {
      return (
        <Table.Row key={ticker.id}>
          <Table.Cell collapsing>
            <Icon
              color={ticker.active ? 'green' : 'red'}
              name={ticker.active ? 'toggle on' : 'toggle off'}
              size={'large'}
            />
          </Table.Cell>
          <Table.Cell>{ticker.title}</Table.Cell>
          <Table.Cell>{ticker.domain}</Table.Cell>
          <Table.Cell collapsing textAlign="right">
            <Button.Group size="small">
              <Button
                color="teal"
                content="Use"
                icon="rocket"
                onClick={this.redirectToTicker.bind(this)}
                ticker={ticker}
              />
              <Button
                color="black"
                content="Edit"
                icon="edit"
                onClick={this.editTicker}
                ticker={ticker}
              />
              {this.renderDeleteButton(ticker)}
            </Button.Group>
          </Table.Cell>
        </Table.Row>
      )
    })
  }

  render() {
    const tickers = this.state.tickers

    if (!tickers) {
      return (
        <React.Fragment>
          <Message
            content="You are not able to see any tickers or no ticker is created yet. If you want to access a
                        specific ticker and dont see them, contact us."
            header="Information"
            icon="info"
          />
          {this.renderTickerForm()}
          {this.renderCreateButton()}
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Domain</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>{this.renderList(tickers)}</Table.Body>
          <Table.Footer fullWidth>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell />
              <Table.HeaderCell />
              <Table.HeaderCell>{this.renderCreateButton()}</Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
        {this.renderTickerForm()}
        <Confirm
          onCancel={this.handleDeleteCancel}
          onConfirm={this.handleDeleteConfirm}
          open={this.state.deleteConfirmOpen}
        />
      </React.Fragment>
    )
  }
}

TickerList.propTypes = {
  history: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
}
