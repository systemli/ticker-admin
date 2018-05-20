import React from 'react';
import {Container, Icon, Image, Menu} from 'semantic-ui-react';
import Clock from "../components/Clock";
import AuthService from "../components/AuthService";
import {withRouter} from "react-router-dom";

class Navigation extends React.Component {
    constructor(props) {
        super(props);

        this.Auth = new AuthService();
    }

    renderUserItem() {
        if (this.Auth.loggedIn()) {
            return (
                <Menu.Item onClick={() => {
                    this.Auth.logout();
                    this.props.history.replace("/login");
                }}><Icon name='user'/>Logout</Menu.Item>
            );
        }
    }

    render() {
        return (
            <Menu fixed='top' size='tiny' inverted>
                <Container>
                    <Menu.Item><Image src='/logo.png' spaced='right'
                                      style={{position: 'absolute', right: 0}}/></Menu.Item>
                    <Menu.Item active={window.location.pathname === '/'} onClick={() => {
                        this.props.history.replace("/")
                    }}><strong>Home</strong></Menu.Item>
                    <Menu.Menu position='right'>
                        <Menu.Item><Clock format='dddd, YY/MM/DD, HH:mm:ss'/></Menu.Item>
                        {this.renderUserItem()}
                    </Menu.Menu>
                </Container>
            </Menu>
        );
    }
}

export default withRouter(Navigation);
