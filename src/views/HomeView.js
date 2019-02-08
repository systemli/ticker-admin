import React from "react";
import {Container, Grid, Header} from "semantic-ui-react";
import withAuth from "../components/withAuth";
import Navigation from "./Navigation";
import TickerList from "../components/TickerList";
import PropTypes from 'prop-types';

class HomeView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container>
                <Navigation history={this.props.history} user={this.props.user}/>
                <Container className='app'>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column>
                                <Header dividing>Available Configurations</Header>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <TickerList user={this.props.user} history={this.props.history}/>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </Container>
        );
    }
}

export default withAuth(HomeView);

HomeView.propTypes = {
    history: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
};
