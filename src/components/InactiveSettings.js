import React from 'react'
import {
  Button,
  Card,
  Form,
  Header,
  Icon,
  Input,
  List,
  Modal,
} from 'semantic-ui-react'
import { getInactiveSettings, putInactiveSettings } from '../api/Settings'
import ReactMarkdown from 'react-markdown'

export default class InactiveSettings extends React.Component {
  constructor(props) {
    super(props)

    this.form = {}

    this.state = {
      inactiveSettings: {},
      modalOpen: false,
    }

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    getInactiveSettings().then(response => {
      if (response.data !== undefined && response.data.setting !== undefined) {
        this.setState({ inactiveSettings: response.data.setting.value })
      }
    })
  }

  handleSubmit(event) {
    if (Object.keys(this.form).length > 0) {
      let formData = { ...this.state.inactiveSettings, ...this.form }

      putInactiveSettings(formData).then(response => {
        if (
          response.data !== undefined &&
          response.data.setting !== undefined
        ) {
          this.setState({ inactiveSettings: response.data.setting.value })
        }
      })
    }

    this.setState({ modalOpen: false })
    event.preventDefault()
  }

  renderForm() {
    return (
      <Form id="editSetting" onSubmit={this.handleSubmit}>
        <Form.Group widths="equal">
          <Form.Input
            defaultValue={this.state.inactiveSettings.headline}
            label="Headline"
            name="headline"
            onChange={(event, input) => (this.form.headline = input.value)}
          />
          <Form.Input
            defaultValue={this.state.inactiveSettings.sub_headline}
            label="Subheadline"
            name="sub_headline"
            onChange={(event, input) => (this.form.sub_headline = input.value)}
          />
        </Form.Group>
        <Form.TextArea
          defaultValue={this.state.inactiveSettings.description}
          label="Description"
          name="description"
          onChange={(event, input) => (this.form.description = input.value)}
          rows="5"
        />
        <Header dividing>Information</Header>
        <Form.Group widths="equal">
          <Form.Input label="Author">
            <Input
              defaultValue={this.state.inactiveSettings.author}
              iconPosition="left"
              name="author"
              onChange={(event, input) => (this.form.author = input.value)}
              placeholder="Author"
            >
              <Icon name="users" />
              <input />
            </Input>
          </Form.Input>
          <Form.Input label="Homepage">
            <Input
              defaultValue={this.state.inactiveSettings.homepage}
              iconPosition="left"
              name="homepage"
              onChange={(event, input) => (this.form.homepage = input.value)}
            >
              <Icon name="home" />
              <input />
            </Input>
          </Form.Input>
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Input label="Email">
            <Input
              defaultValue={this.state.inactiveSettings.email}
              iconPosition="left"
              name="email"
              onChange={(event, input) => (this.form.email = input.value)}
              placeholder="Email"
            >
              <Icon name="at" />
              <input />
            </Input>
          </Form.Input>
          <Form.Input label="Twitter">
            <Input
              defaultValue={this.state.inactiveSettings.twitter}
              iconPosition="left"
              name="twitter"
              onChange={(event, input) => (this.form.twitter = input.value)}
            >
              <Icon name="twitter" />
              <input />
            </Input>
          </Form.Input>
        </Form.Group>
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
        <Header>Edit Inactive Settings</Header>
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
              <Icon name="question circle" />
              Inactive Settings
            </Card.Header>
            <Card.Meta>
              These settings have affect for inactive or non-configured tickers.
            </Card.Meta>
          </Card.Content>
          <Card.Content>
            <Card.Description>
              <List>
                <List.Item>
                  <List.Header>Headline</List.Header>
                  {this.state.inactiveSettings.headline}
                </List.Item>
                <List.Item>
                  <List.Header>Subheadline</List.Header>
                  {this.state.inactiveSettings.sub_headline}
                </List.Item>
                <List.Item>
                  <List.Header>Description</List.Header>
                  <ReactMarkdown>
                    {this.state.inactiveSettings.description}
                  </ReactMarkdown>
                </List.Item>
              </List>
              <Header size="medium">Information</Header>
              <List>
                <List.Item>
                  <List.Icon name="users" />
                  <List.Content>
                    {this.state.inactiveSettings.author}
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Icon name="mail" />
                  <List.Content>
                    {this.state.inactiveSettings.email}
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Icon name="linkify" />
                  <List.Content>
                    {this.state.inactiveSettings.homepage}
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Icon name="twitter" />
                  <List.Content>
                    {this.state.inactiveSettings.twitter}
                  </List.Content>
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
