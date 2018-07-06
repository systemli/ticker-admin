import React from "react";
import withAuth from "../components/withAuth";
import {Container, Grid, Header} from "semantic-ui-react";
import Navigation from "./Navigation";
import InactiveSettings from "../components/InactiveSettings";

class SettingsView extends React.Component {
    render() {
        return (
            <Container>
                <Navigation/>
                <Container className='app'>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column>
                                <Header dividing>Settings</Header>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <InactiveSettings/>
                        </Grid.Row>
                    </Grid>
                </Container>
            </Container>
        );
    }
}

export default withAuth(SettingsView);
