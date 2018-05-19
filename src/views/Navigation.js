import React from 'react';
import {Container, Image, Menu} from 'semantic-ui-react';
import Clock from "../components/Clock";

export default class Navigation extends React.Component {
    render() {
        return (
            <Menu fixed='top' size='tiny' inverted>
                <Container>
                    <Menu.Item><Image src='/logo.png' spaced='right' style={{position: 'absolute', right: 0}}/></Menu.Item>
                    <Menu.Item href='/' active={window.location.pathname === '/'}><strong>Home</strong></Menu.Item>
                    <Menu.Item position='right'><Clock format='dddd, YY/MM/DD, HH:mm:ss'/></Menu.Item>
                </Container>
            </Menu>
        );
    }
}
