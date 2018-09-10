import React from 'react';
import {Button, Card, Confirm, Form, Header, Icon, Input, Label, Modal} from 'semantic-ui-react';
import {deleteTicker, putTicker} from "../api/Ticker";
import {withRouter} from "react-router-dom";
import ReactMarkdown from "react-markdown";
import PropTypes from 'prop-types';

class Ticker extends React.Component {
    constructor(props) {
        super(props);

        this.form = {
            information: {},
        };

        this.state = {
            ticker: {
                id: props.ticker.id || null,
                title: props.ticker.title || '',
                domain: props.ticker.domain || '',
                description: props.ticker.description || '',
                active: props.ticker.active,
                prepend_time: props.ticker.prepend_time,
                information: props.ticker.information || {
                    author: '',
                    url: '',
                    email: '',
                    twitter: '',
                    facebook: '',
                }
            },
            confirmOpen: false,
            modalOpen: false,
            useButton: props.use || false,
            deleteButton: props.delete || false,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.renderUseButton = this.renderUseButton.bind(this);
        this.renderDeleteButton = this.renderDeleteButton.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.openDeleteModal = this.openDeleteModal.bind(this);
        this.closeConfirm = this.closeConfirm.bind(this);
    }

    handleSubmit(event) {
        if (Object.keys(this.form).length > 0) {
            let formData = {
                title: this.form.title || this.state.ticker.title,
                domain: this.form.domain || this.state.ticker.domain,
                description: this.form.description || this.state.ticker.description,
                active: this.form.active !== undefined ? this.form.active : this.state.ticker.active,
                prepend_time: this.form.prepend_time !== undefined ? this.form.prepend_time : this.state.ticker.prepend_time,
                information: this.form.information || {
                    author: this.form.information.author || this.state.ticker.information.author,
                    url: this.form.information.url || this.state.ticker.information.url,
                    email: this.form.information.email || this.state.ticker.information.email,
                    twitter: this.form.information.twitter || this.state.ticker.information.twitter,
                    facebook: this.form.information.facebook || this.state.ticker.information.facebook,
                }
            };

            putTicker(formData, this.state.ticker.id).then(response => this.setState({ticker: response.data.ticker}));
        }

        this.setState({modalOpen: false});
        event.preventDefault();
    }

    openDeleteModal() {
        this.setState({confirmOpen: true});
    }

    handleCancel() {
        this.setState({confirmOpen: false});
    }

    closeConfirm() {
        this.setState({confirmOpen: false});
    }

    closeModal() {
        this.setState({modalOpen: false});
    }

    handleConfirm() {
        deleteTicker(this.state.ticker.id).then(() => {
            if (this.props.reload !== undefined) {
                this.props.reload();
            }
            this.closeConfirm();
        });
    }

    getForm() {
        return (
            <Form onSubmit={this.handleSubmit} id='editTicker'>
                <Form.Group widths='equal'>
                    <Form.Input
                        label='Title'
                        name='title'
                        defaultValue={this.state.ticker.title}
                        onChange={(event, input) => this.form.title = input.value}
                    />
                    <Form.Input
                        label='Domain'
                        name='domain'
                        defaultValue={this.state.ticker.domain}
                        onChange={(event, input) => this.form.domain = input.value}
                    />
                </Form.Group>
                <Form.Checkbox
                    toggle
                    label='Active'
                    name='active'
                    defaultChecked={this.state.ticker.active}
                    onChange={(event, input) => this.form.active = input.checked}
                />
                <Form.Checkbox
                    toggle
                    label='Prepend the message timestamp'
                    name='Prepend the message timestamp'
                    defaultChecked={this.state.ticker.prepend_time}
                    onChange={(event, input) => this.form.prepend_time = input.checked}
                />
                <Form.TextArea
                    label='Description'
                    name='description'
                    rows='5'
                    defaultValue={this.state.ticker.description}
                    onChange={(event, input) => this.form.description = input.value}
                />
                <Header dividing>Information</Header>
                <Form.Group widths='equal'>
                    <Form.Input label='Author'>
                        <Input
                            iconPosition='left'
                            placeholder='Author' name='information.author'
                            defaultValue={this.state.ticker.information.author}
                            onChange={(event, input) => this.form.information.author = input.value}>
                            <Icon name='users'/>
                            <input/>
                        </Input>
                    </Form.Input>
                    <Form.Input label='Homepage'>
                        <Input
                            iconPosition='left'
                            name='information.url'
                            defaultValue={this.state.ticker.information.url}
                            onChange={(event, input) => this.form.information.url = input.value}>
                            <Icon name='home'/>
                            <input/>
                        </Input>
                    </Form.Input>
                </Form.Group>
                <Form.Group widths='equal'>
                    <Form.Input label='Email'>
                        <Input
                            iconPosition='left'
                            placeholder='Email' name='information.email'
                            defaultValue={this.state.ticker.information.email}
                            onChange={(event, input) => this.form.information.email = input.value}>
                            <Icon name='at'/>
                            <input/>
                        </Input>
                    </Form.Input>
                    <Form.Input label='Twitter'>
                        <Input
                            iconPosition='left'
                            name='information.twitter'
                            defaultValue={this.state.ticker.information.twitter}
                            onChange={(event, input) => this.form.information.twitter = input.value}>
                            <Icon name='twitter'/>
                            <input/>
                        </Input>
                    </Form.Input>
                    <Form.Input label='Facebook'>
                        <Input
                            iconPosition='left'
                            name='information.facebook'
                            defaultValue={this.state.ticker.information.facebook}
                            onChange={(event, input) => this.form.information.facebook = input.value}>
                            <Icon name='facebook'/>
                            <input/>
                        </Input>
                    </Form.Input>
                </Form.Group>
            </Form>
        );
    }

    getModal() {
        return (
            <Modal trigger={<Button color='black' icon='edit' content='edit'
                                    onClick={() => this.setState({modalOpen: true})}/>}
                   dimmer='blurring' open={this.state.modalOpen} closeIcon
                   onClose={this.closeModal}
            >
                <Header>Edit {this.state.ticker.title}</Header>
                <Modal.Content>
                    {this.getForm()}
                </Modal.Content>
                <Modal.Actions>
                    <Button.Group>
                        <Button type='submit' color='green' content='Save' form='editTicker'/>
                        <Button.Or/>
                        <Button color='red' content='Close' onClick={this.closeModal}/>
                    </Button.Group>
                </Modal.Actions>
            </Modal>
        );
    }

    renderUseButton() {
        if (this.state.useButton) {
            return (
                <Button color='teal' icon='rocket' content='Use' onClick={() => {this.props.history.replace(`/ticker/${this.state.ticker.id}`)}}/>
            );
        }
    }

    renderDeleteButton() {
        if (this.state.deleteButton) {
            return (
                <Button color='red' icon='delete' content='Delete' onClick={this.openDeleteModal}/>
            );
        }
    }

    render() {
        return (
            <Card fluid={this.props.fluid}>
                <Card.Content>
                    <Card.Header>
                        <Icon color={this.state.ticker.active ? 'green' : 'red'}
                              name={this.state.ticker.active ? 'toggle on' : 'toggle off'}
                        />
                        {this.state.ticker.title}
                        <Label content={this.state.ticker.id} size='mini' style={{float: 'right'}}/>
                    </Card.Header>
                    <Card.Meta content={this.state.ticker.domain}/>
                    <Card.Description content={<ReactMarkdown source={this.state.ticker.description} />}/>
                    <Icon color={this.state.ticker.active ? 'green' : 'red'}
                    name={this.state.ticker.prepend_time ? 'toggle on' : 'toggle off'}
                    /> Prepend Time
                </Card.Content>
                <Card.Content>
                    <Button.Group size='tiny' fluid compact>
                        {this.renderUseButton()}
                        {this.getModal()}
                        {this.renderDeleteButton()}

                    </Button.Group>
                </Card.Content>
                <Confirm open={this.state.confirmOpen}
                         onCancel={this.handleCancel}
                         onConfirm={this.handleConfirm}
                         dimmer='blurring'
                         size='mini'
                />
            </Card>
        );
    }
}

export default withRouter(Ticker);

Ticker.propTypes = {
    ticker: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        domain: PropTypes.string,
        description: PropTypes.string,
        active: PropTypes.bool,
        prepend_time: PropTypes.bool,
        information: PropTypes.shape({
            author: PropTypes.string,
            url: PropTypes.string,
            email: PropTypes.string,
            twitter: PropTypes.string,
            facebook: PropTypes.string,
        })
    }),
    history: PropTypes.any.isRequired,
    fluid: PropTypes.bool,
    use: PropTypes.bool,
    delete: PropTypes.bool,
    reload: PropTypes.func,
};
