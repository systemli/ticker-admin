import React from "react";
import {Button, Card, Checkbox, Container, Form, Grid, Header, Icon, Input, Loader, Modal} from "semantic-ui-react";
import Ticker from "./Ticker";
import {getTickers, postTicker} from "../api/Ticker";

export default class TickerList extends React.Component {
    constructor(props) {
        super(props);

        this.form = {
            active: false,
            information: {},
        };

        this.state = {
            tickers: [],
            isLoading: false,
            modalOpen: false
        };

        this._fetch = this._fetch.bind(this);
        this.reload = this.reload.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.reload = this.reload.bind(this);
    }

    componentDidMount() {
        this._fetch();
    }

    _fetch() {
        getTickers().then(data => this.setState({tickers: data.data.tickers}));
    }

    reload() {
        this.setState({isConfigurationLoading: true});
        this._fetch();
        this.setState({isConfigurationLoading: false});
    }

    closeModal = () => {
        this.setState({modalOpen: false})
    };

    handleSubmit(event) {
        if (Object.keys(this.form).length > 0) {
            postTicker(this.form).then(() => {
                this.setState({modalOpen: false});
                this.reload();
            });
        }

        event.preventDefault();
    }

    getForm() {
        return (
            <Modal trigger={<Button color='green' icon='plus' content='Create'
                                    onClick={() => this.setState({modalOpen: true})}/>}
                   dimmer='blurring' closeOnRootNodeClick={false} open={this.state.modalOpen} closeIcon
                   onClose={() => this.setState({modalOpen: false})}
                //https://github.com/Semantic-Org/Semantic-UI-React/issues/2558
                   style={{marginTop: '0px !important', marginLeft: 'auto', marginRight: 'auto'}}>
                <Header>Create Configuration</Header>
                <Modal.Content>
                    <Form onSubmit={this.handleSubmit} id='editTicker'>
                        <Form.Group widths='equal'>
                            <Form.Input
                                label='Title'
                                name='title'
                                onChange={(event, input) => this.form.title = input.value}
                            />
                            <Form.Input
                                label='Domain'
                                name='domain'
                                onChange={(event, input) => this.form.domain = input.value}
                            />
                        </Form.Group>
                        <Form.Checkbox
                            toggle
                            label='Active'
                            name='active'
                            onChange={(event, input) => this.form.active = input.checked}
                        />
                        <Form.TextArea
                            label='Description'
                            name='description'
                            rows='5'
                            onChange={(event, input) => this.form.description = input.value}
                        />
                        <Header dividing>Information</Header>
                        <Form.Group widths='equal'>
                            <Form.Input label='Author'>
                                <Input
                                    iconPosition='left'
                                    placeholder='Author' name='information.author'
                                    onChange={(event, input) => this.form.information.author = input.value}>
                                    <Icon name='users'/>
                                    <input/>
                                </Input>
                            </Form.Input>
                            <Form.Input label='Homepage'>
                                <Input
                                    iconPosition='left'
                                    name='information.url'
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
                                    onChange={(event, input) => this.form.information.email = input.value}>
                                    <Icon name='at'/>
                                    <input/>
                                </Input>
                            </Form.Input>
                            <Form.Input label='Twitter'>
                                <Input
                                    iconPosition='left'
                                    name='information.twitter'
                                    onChange={(event, input) => this.form.information.twitter = input.value}>
                                    <Icon name='twitter'/>
                                    <input/>
                                </Input>
                            </Form.Input>
                            <Form.Input label='Facebook'>
                                <Input
                                    iconPosition='left'
                                    name='information.facebook'
                                    onChange={(event, input) => this.form.information.facebook = input.value}>
                                    <Icon name='facebook'/>
                                    <input/>
                                </Input>
                            </Form.Input>
                        </Form.Group>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button.Group>
                        <Button type='submit' color='green' content='Create' form='editTicker'/>
                        <Button.Or/>
                        <Button color='red' content='Close' onClick={this.closeModal}/>
                    </Button.Group>
                </Modal.Actions>
            </Modal>
        );
    }

    render() {
        const tickers = this.state.tickers || [];

        return (
            <Container>
                <Grid>
                    <Grid.Column>
                        <Icon name='refresh'
                              loading={this.state.isLoading}
                              onClick={this.reload}
                              style={{float: 'right', paddingTop: 30}}
                        />
                        <Header dividing>Available Configurations</Header>
                        <Loader active={this.state.isLoading} size='large'/>
                        <Card.Group>
                            {tickers.map(ticker => <Ticker use delete key={ticker.id} ticker={ticker}
                                                           reload={this.reload}/>)}
                        </Card.Group>
                    </Grid.Column>
                </Grid>
                <Grid>
                    <Grid.Column>
                        {this.getForm()}
                    </Grid.Column>
                </Grid>
            </Container>
        );
    }
}
