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
          icon="rocket"
          content="Use"
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
        icon={'edit'}
        content={'edit'}
        onClick={this.editTicker}
      />
    )
  }

  renderDeleteButton() {
    if (this.state.deleteButton) {
      return (
        <Button
          color="red"
          icon="delete"
          content="Delete"
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
      <TickerForm ticker={this.props.ticker} callback={this.closeEditForm} />
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
              target="_blank"
              rel="noopener noreferrer"
              href={'https://' + this.props.ticker.domain}
            >
              {this.props.ticker.domain}
            </a>
          </Card.Meta>
          <Card.Description>
            <ReactMarkdown source={this.props.ticker.description} />
          </Card.Description>
        </Card.Content>
        <Card.Content>
          <Button.Group size="tiny" fluid compact>
            {this.renderUseButton()}
            {this.renderEditButton()}
            {this.renderDeleteButton()}
          </Button.Group>
        </Card.Content>
        <Confirm
          open={this.state.confirmOpen}
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
          dimmer
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
