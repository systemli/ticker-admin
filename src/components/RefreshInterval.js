import React from 'react'
import {
  Button,
  Card,
  Form,
  Header,
  Icon,
  List,
  Modal,
} from 'semantic-ui-react'
import { getRefreshInterval, putRefreshInterval } from '../api/Settings'

export default class RefreshInterval extends React.Component {
  constructor(props) {
    super(props)

    this.form = {}

    this.state = {
      refresh_interval: undefined,
      modalOpen: false,
    }

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    getRefreshInterval().then(response => {
      if (response.data !== undefined && response.data.setting !== undefined) {
        this.setState({ refresh_interval: response.data.setting.value })
      }
    })
  }

  handleSubmit(event) {
    if (Object.keys(this.form).length > 0) {
      let formData = {
        refresh_interval: parseInt(this.form.refresh_interval, 10),
      }

      putRefreshInterval(formData).then(response => {
        if (
          response.data !== undefined &&
          response.data.setting !== undefined
        ) {
          this.setState({ refresh_interval: response.data.setting.value })
        }
      })
    }

    this.setState({ modalOpen: false })
    event.preventDefault()
  }

  renderForm() {
    return (
      <Form id="editSetting" onSubmit={this.handleSubmit}>
        <Form.Input
          defaultValue={this.state.refresh_interval}
          label="Interval"
          name="refresh_interval"
          onChange={(event, input) =>
            (this.form.refresh_interval = input.value)
          }
        />
      </Form>
    )
  }

  renderModal() {
    return (
      <Modal
        closeIcon
        dimmer
        onClose={() => this.setState({ modalOpen: false })}
        open={this.state.modalOpen}
        trigger={
          <Button
            color="black"
            content="edit"
            icon="edit"
            onClick={() => this.setState({ modalOpen: true })}
          />
        }
      >
        <Header>Edit Refresh Interval</Header>
        <Modal.Content>{this.renderForm()}</Modal.Content>
        <Modal.Actions>
          <Button.Group>
            <Button
              color="green"
              content="Save"
              form="editSetting"
              type="submit"
            />
            <Button.Or />
            <Button
              color="red"
              content="Close"
              onClick={() => this.setState({ modalOpen: false })}
            />
          </Button.Group>
        </Modal.Actions>
      </Modal>
    )
  }

  render() {
    return (
      <React.Fragment>
        <Card>
          <Card.Content>
            <Card.Header>
              <Icon name="refresh" />
              Refresh Interval
            </Card.Header>
            <Card.Meta>
              These setting configures the reload interval for the frontend
            </Card.Meta>
          </Card.Content>
          <Card.Content>
            <Card.Description>
              <List>
                <List.Item>
                  <List.Icon name="rocket" />
                  <List.Content>{this.state.refresh_interval} ms</List.Content>
                </List.Item>
              </List>
            </Card.Description>
          </Card.Content>
          <Card.Content>{this.renderModal()}</Card.Content>
        </Card>
      </React.Fragment>
    )
  }
}
