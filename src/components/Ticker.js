import React from 'react'
import { Button, Card, Confirm, Icon, Label } from 'semantic-ui-react'
import { deleteTicker } from '../api/Ticker'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'
import TickerForm from './TickerForm'

export default class Ticker extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      confirmOpen: false,
      modalOpen: false,
      useButton: props.use || false,
      deleteButton: props.delete || false,
      closeEditForm: false,
    }

    this.handleConfirm = this.handleConfirm.bind(this)
    this.renderUseButton = this.renderUseButton.bind(this)
    this.renderDeleteButton = this.renderDeleteButton.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.openDeleteModal = this.openDeleteModal.bind(this)
    this.closeConfirm = this.closeConfirm.bind(this)
    this.editTicker = this.editTicker.bind(this)
    this.closeEditForm = this.closeEditForm.bind(this)
  }

  openDeleteModal() {
    this.setState({ confirmOpen: true })
  }

  handleCancel() {
    this.setState({ confirmOpen: false })
  }

  closeConfirm() {
    this.setState({ confirmOpen: false })
  }

  editTicker() {
    this.setState({ showEditForm: true })
  }

  closeEditForm(ticker) {
    this.setState({ showEditForm: false })

    this.props.callback(ticker)
  }

  handleConfirm() {
    deleteTicker(this.props.ticker.id).then(() => {
      if (this.props.reload !== undefined) {
        this.props.reload()
      }
      this.closeConfirm()
    })
  }

  renderUseButton() {
    if (this.state.useButton) {
      return (
        <Button
          color="teal"
          content="Use"
          icon="rocket"
          onClick={() => {
            this.props.history.replace(`/ticker/${this.state.ticker.id}`)
          }}
        />
      )
    }
  }

  renderEditButton() {
    return (
      <Button
        color={'black'}
        content={'edit'}
        icon={'edit'}
        onClick={this.editTicker}
      />
    )
  }

  renderDeleteButton() {
    if (this.state.deleteButton) {
      return (
        <Button
          color="red"
          content="Delete"
          icon="delete"
          onClick={this.openDeleteModal}
        />
      )
    }
  }

  renderEditForm() {
    if (!this.state.showEditForm) {
      return null
    }

    return (
      <TickerForm callback={this.closeEditForm} ticker={this.props.ticker} />
    )
  }

  render() {
    return (
      <Card fluid={this.props.fluid}>
        <Card.Content>
          <Card.Header>
            <Icon
              color={this.props.ticker.active ? 'green' : 'red'}
              name={this.props.ticker.active ? 'toggle on' : 'toggle off'}
            />
            {this.props.ticker.title}
            <Label
              content={this.props.ticker.id}
              size="mini"
              style={{ float: 'right' }}
            />
          </Card.Header>
          <Card.Meta>
            <a
              href={'https://' + this.props.ticker.domain}
              rel="noopener noreferrer"
              target="_blank"
            >
              {this.props.ticker.domain}
            </a>
          </Card.Meta>
          <Card.Description>
            <ReactMarkdown>{this.props.ticker.description}</ReactMarkdown>
          </Card.Description>
        </Card.Content>
        <Card.Content>
          <Button.Group compact fluid size="tiny">
            {this.renderUseButton()}
            {this.renderEditButton()}
            {this.renderDeleteButton()}
          </Button.Group>
        </Card.Content>
        <Confirm
          dimmer
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
          open={this.state.confirmOpen}
          size="mini"
        />
        {this.renderEditForm()}
      </Card>
    )
  }
}

Ticker.propTypes = {
  callback: PropTypes.func,
  ticker: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    domain: PropTypes.string,
    description: PropTypes.string,
    active: PropTypes.bool,
    information: PropTypes.shape({
      author: PropTypes.string,
      url: PropTypes.string,
      email: PropTypes.string,
      twitter: PropTypes.string,
      facebook: PropTypes.string,
    }),
  }),
  history: PropTypes.object.isRequired,
  fluid: PropTypes.bool,
  use: PropTypes.bool,
  delete: PropTypes.bool,
  reload: PropTypes.func,
}
