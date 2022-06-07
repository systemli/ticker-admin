import React from 'react'
import {
  Button,
  Confirm,
  Container,
  Form,
  Header,
  Icon,
  Label,
  Message,
  Modal,
  Table,
} from 'semantic-ui-react'
import { deleteUser, getUsers, postUser, putUser } from '../api/User'
import Moment from 'react-moment'
import TickersDropdown from './TickersDropdown'

export default class UserList extends React.Component {
  constructor(props) {
    super(props)

    this.form = {}

    this.state = {
      users: [],
      deleteUser: null,
      editUser: null,
      showModal: false,
      showDeleteConfirm: false,
    }

    this.openModal = this.openModal.bind(this)
    this.renderModal = this.renderModal.bind(this)
    this.handleForm = this.handleForm.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.renderForm = this.renderForm.bind(this)
    this.reloadUsers = this.reloadUsers.bind(this)
  }

  componentDidMount() {
    this.reloadUsers()
  }

  reloadUsers() {
    getUsers().then(response => {
      this.setState({ users: response.data.users })
    })
  }

  openModal(user) {
    this.setState({ showModal: true, editUser: user })
  }

  handleForm() {
    let call

    if (this.state.editUser) {
      call = putUser(this.form, this.state.editUser.id)
    } else {
      call = postUser(this.form)
    }

    call.then(() => {
      this.setState({ editUser: null, showModal: false })
      this.reloadUsers()
    })
  }

  handleDelete() {
    if (this.state.deleteUser) {
      deleteUser(this.state.deleteUser.id).then(() => {
        this.setState({ showDeleteConfirm: false, deleteUser: null })

        this.reloadUsers()
      })
    }
  }

  renderForm() {
    return (
      <Form id="userForm" onSubmit={this.handleForm}>
        <Form.Group widths="2">
          <Form.Input
            defaultValue={this.state.editUser ? this.state.editUser.email : ''}
            label="Email"
            name="email"
            onChange={(event, input) => (this.form.email = input.value)}
            required
          />
        </Form.Group>
        <Form.Checkbox
          defaultChecked={
            this.state.editUser ? this.state.editUser.is_super_admin : false
          }
          label="Super Admin"
          name="is_super_admin"
          onChange={(event, input) =>
            (this.form.is_super_admin = input.checked)
          }
          toggle
        />
        <Form.Group widths="equal">
          <Form.Input
            label="Password"
            name="password"
            onChange={(event, input) => (this.form.password = input.value)}
            required={!this.state.editUser}
            type="password"
          />
          <Form.Input
            label="Repeat Password"
            name="password"
            required={!this.state.editUser}
            type="password"
            //TODO: check password
          />
        </Form.Group>
        {this.renderTickerDropdown()}
      </Form>
    )
  }

  renderTickerDropdown() {
    if (
      (this.state.editUser && this.state.editUser.is_super_admin) ||
      this.form.is_super_admin
    ) {
      return (
        <Container>
          <Header>Permissions</Header>
          <Message info>
            Admin Users don't need special permissions for Tickers.
          </Message>
        </Container>
      )
    }

    return (
      <Container>
        <Header>Permissions</Header>
        <TickersDropdown
          defaultValue={
            this.state.editUser ? this.state.editUser.tickers : undefined
          }
          onChange={(event, input) => (this.form.tickers = input.value)}
          placeholder="Select a Ticker"
        />
      </Container>
    )
  }

  renderModal(user) {
    let isNew = this.state.editUser === undefined

    return (
      <Modal
        closeIcon
        dimmer
        onClose={() => this.setState({ showModal: false, editUser: undefined })}
        open={this.state.showModal}
        size="small"
      >
        <Header>{isNew ? 'Create User' : 'Edit User'}</Header>
        <Modal.Content>{this.renderForm(user)}</Modal.Content>
        <Modal.Actions>
          <Button.Group>
            <Button
              color="green"
              content={this.state.editUser ? 'Update' : 'Create'}
              form="userForm"
              type="submit"
            />
            <Button.Or />
            <Button
              color="red"
              content="Close"
              onClick={() => this.setState({ showModal: false })}
            />
          </Button.Group>
        </Modal.Actions>
      </Modal>
    )
  }

  renderDeleteConfirm() {
    return (
      <Confirm
        dimmer
        onCancel={() => this.setState({ showDeleteConfirm: false })}
        onConfirm={this.handleDelete}
        open={this.state.showDeleteConfirm}
        size="mini"
      />
    )
  }

  render() {
    const users = this.state.users || []

    return (
      <React.Fragment>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Admin</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Creation Time</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {users.map(user => {
              return (
                <Table.Row key={user.id}>
                  <Table.Cell>{user.id}</Table.Cell>
                  <Table.Cell>
                    <Label color={user.is_super_admin ? 'yellow' : 'green'}>
                      <Icon
                        name={
                          user.is_super_admin ? 'check circle' : 'remove circle'
                        }
                      />
                      {user.is_super_admin ? 'Yes' : 'No'}
                    </Label>
                  </Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    <Moment date={user.creation_date} fromNow />
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <Button.Group size="small">
                      <Button
                        color="black"
                        content="Edit"
                        icon="edit"
                        onClick={() => {
                          this.openModal(user)
                        }}
                      />
                      <Button
                        color="red"
                        content="Delete"
                        icon="delete"
                        onClick={() => {
                          this.setState({
                            showDeleteConfirm: true,
                            deleteUser: user,
                          })
                        }}
                      />
                    </Button.Group>
                  </Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>

          <Table.Footer fullWidth>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell />
              <Table.HeaderCell />
              <Table.HeaderCell />
              <Table.HeaderCell>
                <Button
                  floated="right"
                  icon
                  labelPosition="left"
                  onClick={() => {
                    this.openModal()
                  }}
                  primary
                  size="small"
                >
                  <Icon name="user" /> Add User
                </Button>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
        {this.renderModal()}
        {this.renderDeleteConfirm()}
      </React.Fragment>
    )
  }
}
