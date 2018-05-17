import React from "react";
import {Button, Card, Checkbox, Container, Form, Grid, Header, Icon, Input, Modal} from "semantic-ui-react";
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
                        <Form.Field>
                            <Input required label='Title' name='title'
                                   onChange={(event, input) => this.form.title = input.value}/>
                        </Form.Field>
                        <Form.Field>
                            <Input required label='Description' name='description'
                                   onChange={(event, input) => this.form.description = input.value}/>
                        </Form.Field>
                        <Form.Field>
                            <Input required label='Domain' name='domain'
                                   onChange={(event, input) => this.form.domain = input.value}/>
                        </Form.Field>
                        <Form.Field>
                            <Checkbox toggle label='Active' name='active'
                                      onChange={(event, input) => this.form.active = input.checked}/>
                        </Form.Field>
                        <Header dividing>Contact Details</Header>
                        <Form.Field>
                            <Input label='Homepage' name='information.url'
                                   onChange={(event, input) => this.form.information.url = input.value}/>
                        </Form.Field>
                        <Form.Field>
                            <Input label='E-Mail' name='information.email'
                                   onChange={(event, input) => this.form.information.email = input.value}/>
                        </Form.Field>
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

        return (<Container>
                <Grid>
                    <Grid.Column>
                        <Icon name='refresh'
                              loading={this.state.isLoading}
                              onClick={this.reload}
                              style={{float: 'right', paddingTop: 35}}
                        />
                        <Header size='large' dividing>Available Configurations</Header>
                        <Card.Group>
                            {tickers.map(ticker => <Ticker key={ticker.id} ticker={ticker} reload={this.reload}/>)}
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
