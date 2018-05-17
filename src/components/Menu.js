import React from 'react';
import {Container, Icon, Image, Item} from 'semantic-ui-react';
import {Menu as BaseMenu} from 'semantic-ui-react';

export default class Menu extends React.Component {
    render() {
        return (<BaseMenu fixed='top' inverted>
            <Container>
                <Item as='a' href='/' className='header'>
                    <Image src='https://www.systemli.org/assets/img/systemli_logo_small.png' spaced='right' avatar/>
                    Ticker
                </Item>
                <Item as='a' href='/'><Icon name='dashboard'/>Home</Item>
            </Container>
        </BaseMenu>);
    }
}
