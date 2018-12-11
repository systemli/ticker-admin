import React from 'react';
import {Button, Card, Confirm, Form, Header, Icon, Input, Label, Modal} from 'semantic-ui-react';
import {deleteTicker, putTicker} from "../api/Ticker";
import {withRouter} from "react-router-dom";
import PropTypes from 'prop-types';
import ReactMarkdown from "react-markdown";
import TickerForm from "./TickerForm";

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
            closeEditForm: false,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.renderUseButton = this.renderUseButton.bind(this);
        this.renderDeleteButton = this.renderDeleteButton.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.openDeleteModal = this.openDeleteModal.bind(this);
        this.closeConfirm = this.closeConfirm.bind(this);
        this.editTicker = this.editTicker.bind(this);
        this.closeEditForm = this.closeEditForm.bind(this);
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

            putTicker(formData, this.state.ticker.id).then((response) => {
                this.setState({ticker: response.data.ticker});
                this.props.onSubmitSuccess(response.data.ticker);
            });
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

    editTicker() {
        this.setState({showEditForm: true});
    }

    closeEditForm(ticker) {
        this.setState({showEditForm: false, ticker: ticker});
    }

    handleConfirm() {
        deleteTicker(this.state.ticker.id).then(() => {
            if (this.props.reload !== undefined) {
                this.props.reload();
            }
            this.closeConfirm();
        });
    }

    renderUseButton() {
        if (this.state.useButton) {
            return (
                <Button color='teal' icon='rocket' content='Use' onClick={() => {
                    this.props.history.replace(`/ticker/${this.state.ticker.id}`)
                }}/>
            );
        }
    }

    renderEditButton() {
        return (
            <Button color={'black'} icon={'edit'} content={'edit'} onClick={this.editTicker}/>
        );
    }

    renderDeleteButton() {
        if (this.state.deleteButton) {
            return (
                <Button color='red' icon='delete' content='Delete' onClick={this.openDeleteModal}/>
            );
        }
    }

    renderEditForm() {
        if (!this.state.showEditForm) {
            return null;
        }

        return (
            <TickerForm ticker={this.state.ticker} callback={this.closeEditForm}/>
        );
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
                    <Card.Description>
                        <ReactMarkdown source={this.state.ticker.description}/>
                    </Card.Description>
                </Card.Content>
                <Card.Content>
                    <Card.Description>
                        <Header content={'Settings'} size={'small'}/>
                        <Icon color={this.state.ticker.prepend_time ? 'green' : 'red'}
                              name={this.state.ticker.prepend_time ? 'toggle on' : 'toggle off'}
                        /> Prepend Time
                    </Card.Description>
                </Card.Content>
                <Card.Content>
                    <Button.Group size='tiny' fluid compact>
                        {this.renderUseButton()}
                        {this.renderEditButton()}
                        {this.renderDeleteButton()}

                    </Button.Group>
                </Card.Content>
                <Confirm open={this.state.confirmOpen}
                         onCancel={this.handleCancel}
                         onConfirm={this.handleConfirm}
                         dimmer='blurring'
                         size='mini'
                />
                {this.renderEditForm()}
            </Card>
        );
    }
}

export default withRouter(Ticker);

Ticker.propTypes = {
    onSubmitSuccess: PropTypes.func,
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
