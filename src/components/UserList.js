import React from "react";
import {Button, Container, Form, Header, Icon, Label, Loader, Modal, Table} from "semantic-ui-react";
import {getUsers, postUser, putUser} from "../api/User";
import Moment from "react-moment";

class UserList extends React.Component {
    constructor(props) {
        super(props);

        this.form = {};

        this.state = {
            users: [],
            isLoading: true,
            showModal: false,
            editUser: null,
        };

        this.openModal = this.openModal.bind(this);
        this.renderModal = this.renderModal.bind(this);
        this.handleForm = this.handleForm.bind(this);
        this.renderForm = this.renderForm.bind(this);
        this.reloadUsers = this.reloadUsers.bind(this);
    }

    componentWillMount() {
        this.reloadUsers();
    }

    reloadUsers() {
        this.setState({isLoading: true});

        getUsers().then(response => {
            this.setState({users: response.data.users, isLoading: false});
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
            </Form>
        );
    }

    renderModal(user) {
        let isNew = this.state.editUser === undefined;

        return (
            <Modal
                dimmer='blurring'
                closeOnRootNodeClick={false}
                open={this.state.showModal}
                closeIcon
                onClose={() => this.setState({showModal: false, editUser: undefined})}
                size='small'
                //https://github.com/Semantic-Org/Semantic-UI-React/issues/2558
                style={{marginTop: '0px !important', marginLeft: 'auto', marginRight: 'auto'}}>
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

    render() {
        const users = this.state.users || [];

        return (
            <Container>
                <Loader active={this.state.isLoading}/>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>ID</Table.HeaderCell>
                            <Table.HeaderCell>Admin</Table.HeaderCell>
                            <Table.HeaderCell>Email</Table.HeaderCell>
                            <Table.HeaderCell>Creation Time</Table.HeaderCell>
                            <Table.HeaderCell>Roles</Table.HeaderCell>
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
                                    <Table.Cell>{user.roles}</Table.Cell>
                                    <Table.Cell textAlign='right'>
                                        <Button icon='edit'
                                                labelPosition='left'
                                                size='mini'
                                                content='Edit'
                                                onClick={() => {
                                                    this.openModal(user)
                                                }}
                                        />
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
                            <Table.HeaderCell/>
                            <Table.HeaderCell>
                                <Button floated='right' icon labelPosition='left' primary size='small'
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
            </Container>
        );
    }
}

export default UserList;
