import React from "react";
import {Button, Confirm, Container, Form, Header, Icon, Label, Message, Modal, Table} from "semantic-ui-react";
import {deleteUser, getUsers, postUser, putUser} from "../api/User";
import Moment from "react-moment";
import TickersDropdown from "./TickersDropdown";

export default class UserList extends React.Component {
    constructor(props) {
        super(props);

        this.form = {};

        this.state = {
            users: [],
            deleteUser: null,
            editUser: null,
            showModal: false,
            showDeleteConfirm: false,
        };

        this.openModal = this.openModal.bind(this);
        this.renderModal = this.renderModal.bind(this);
        this.handleForm = this.handleForm.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.renderForm = this.renderForm.bind(this);
        this.reloadUsers = this.reloadUsers.bind(this);
    }

    componentDidMount() {
        this.reloadUsers();
    }

    reloadUsers() {
        getUsers().then(response => {
            this.setState({users: response.data.users});
        });
    }

    openModal(user) {
        this.setState({showModal: true, editUser: user});
    }

    handleForm() {
        let call;

        if (this.state.editUser) {
            call = putUser(this.form, this.state.editUser.id);
        } else {
            call = postUser(this.form);
        }

        call.then(() => {
            this.setState({editUser: null, showModal: false});
            this.reloadUsers();
        });
    }

    handleDelete() {
        if (this.state.deleteUser) {
            deleteUser(this.state.deleteUser.id).then(() => {
                this.setState({showDeleteConfirm: false, deleteUser: null});

                this.reloadUsers();
            });
        }
    }

    renderForm() {
        return (
            <Form onSubmit={this.handleForm} id='userForm'>
                <Form.Group widths='2'>
                    <Form.Input
                        required
                        label='Email'
                        name='email'
                        defaultValue={this.state.editUser ? this.state.editUser.email : ''}
                        onChange={(event, input) => this.form.email = input.value}
                    />
                </Form.Group>
                <Form.Checkbox
                    toggle
                    label='Super Admin'
                    name='is_super_admin'
                    defaultChecked={this.state.editUser ? this.state.editUser.is_super_admin : false}
                    onChange={(event, input) => this.form.is_super_admin = input.checked}
                />
                <Form.Group widths='equal'>
                    <Form.Input
                        required={!this.state.editUser}
                        label='Password'
                        name='password'
                        type='password'
                        onChange={(event, input) => this.form.password = input.value}
                    />
                    <Form.Input
                        required={!this.state.editUser}
                        label='Repeat Password'
                        name='password'
                        type='password'
                        //TODO: check password
                    />
                </Form.Group>
                {this.renderTickerDropdown()}
            </Form>
        );
    }

    renderTickerDropdown() {
        if ((this.state.editUser && this.state.editUser.is_super_admin) || this.form.is_super_admin) {
            return (
                <Container>
                    <Header>Permissions</Header>
                    <Message info>Admin Users don't need special permissions for Tickers.</Message>
                </Container>
            );
        }

        return (
            <Container>
                <Header>Permissions</Header>
                <TickersDropdown
                    placeholder='Select a Ticker'
                    defaultValue={this.state.editUser ? this.state.editUser.tickers : undefined}
                    onChange={(event, input) => this.form.tickers = input.value}
                />
            </Container>
        );
    }

    renderModal(user) {
        let isNew = this.state.editUser === undefined;

        return (
            <Modal
                dimmer='blurring'
                open={this.state.showModal}
                closeIcon
                onClose={() => this.setState({showModal: false, editUser: undefined})}
                size='small'
            >
                <Header>{isNew ? 'Create User' : 'Edit User'}</Header>
                <Modal.Content>
                    {this.renderForm(user)}
                </Modal.Content>
                <Modal.Actions>
                    <Button.Group>
                        <Button type='submit' color='green' content={this.state.editUser ? 'Update' : 'Create'}
                                form='userForm'/>
                        <Button.Or/>
                        <Button color='red' content='Close' onClick={() => this.setState({showModal: false})}/>
                    </Button.Group>
                </Modal.Actions>
            </Modal>
        );
    }

    renderDeleteConfirm() {
        return (
            <Confirm open={this.state.showDeleteConfirm}
                     onCancel={() => {
                         this.setState({showDeleteConfirm: false})
                     }}
                     onConfirm={this.handleDelete}
                     dimmer='blurring'
                     size='mini'
                //https://github.com/Semantic-Org/Semantic-UI-React/issues/2558
                     style={{marginTop: '0px !important', marginLeft: 'auto', marginRight: 'auto'}}
            />
        );
    }

    render() {
        const users = this.state.users || [];

        return (
            <React.Fragment>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>ID</Table.HeaderCell>
                            <Table.HeaderCell>Admin</Table.HeaderCell>
                            <Table.HeaderCell>Email</Table.HeaderCell>
                            <Table.HeaderCell>Creation Time</Table.HeaderCell>
                            <Table.HeaderCell/>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {users.map(user => {
                            return (
                                <Table.Row key={user.id}>
                                    <Table.Cell>{user.id}</Table.Cell>
                                    <Table.Cell><Label color={user.is_super_admin ? 'yellow' : 'green'}><Icon
                                        name={user.is_super_admin ? 'check circle' : 'remove circle'}/>{user.is_super_admin ? 'Yes' : 'No'}
                                    </Label></Table.Cell>
                                    <Table.Cell>{user.email}</Table.Cell>
                                    <Table.Cell><Moment fromNow date={user.creation_date}/></Table.Cell>
                                    <Table.Cell textAlign='right'>
                                        <Button.Group size='small'>
                                            <Button icon='edit'
                                                    color='black'
                                                    content='Edit'
                                                    onClick={() => {
                                                        this.openModal(user)
                                                    }}
                                            />
                                            <Button icon='delete'
                                                    color='red'
                                                    content='Delete'
                                                    onClick={() => {
                                                        this.setState({showDeleteConfirm: true, deleteUser: user});
                                                    }}
                                            />
                                        </Button.Group>
                                    </Table.Cell>
                                </Table.Row>
                            );
                        })}
                    </Table.Body>

                    <Table.Footer fullWidth>
                        <Table.Row>
                            <Table.HeaderCell/>
                            <Table.HeaderCell/>
                            <Table.HeaderCell/>
                            <Table.HeaderCell/>
                            <Table.HeaderCell>
                                <Button floated='right' icon labelPosition='left' primary
                                        size='small'
                                        onClick={() => {
                                            this.openModal()
                                        }}>
                                    <Icon name='user'/> Add User
                                </Button>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
                {this.renderModal()}
                {this.renderDeleteConfirm()}
            </React.Fragment>
        );
    }
}
