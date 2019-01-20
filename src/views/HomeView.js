import React from "react";
import {Container, Grid, Header} from "semantic-ui-react";
import withAuth from "../components/withAuth";
import Navigation from "./Navigation";
import TickerList from "../components/TickerList";

class HomeView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container>
                <Navigation/>
                <Container className='app'>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column>
                                <Header dividing>Available Ticker Configurations</Header>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <TickerList/>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </Container>
        );
    }
}

export default withAuth(HomeView);
