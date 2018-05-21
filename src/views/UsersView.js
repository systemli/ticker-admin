import React from "react";
import withAuth from "../components/withAuth";
import {Container, Grid, Header} from "semantic-ui-react";
import Navigation from "./Navigation";
import UserList from "../components/UserList";

class UsersView extends React.Component {
    render() {
        return (
            <Container>
                <Navigation/>
                <Container className='app'>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column>
                                <Header dividing>Users</Header>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <UserList/>
                        </Grid.Row>
                    </Grid>
                </Container>
            </Container>
        );
    }
}

export default withAuth(UsersView);
