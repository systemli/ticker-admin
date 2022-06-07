import React from 'react'
import { Container, Dropdown, Image, Menu } from 'semantic-ui-react'
import Clock from '../components/Clock'
import AuthSingleton from '../components/AuthService'
import logo from '../assets/logo.png'
import PropTypes from 'prop-types'

const Auth = AuthSingleton.getInstance()

export default class Navigation extends React.Component {
  renderUserItem() {
    if (Auth.loggedIn()) {
      return (
        <Dropdown item text={this.props.user.email}>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => {
                Auth.removeToken()
                this.props.history.push('/login')
              }}
            >
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )
    }
  }

  renderUsersItem() {
    if (this.props.user.is_super_admin) {
      return (
        <Menu.Item
          active={window.location.pathname === '/users'}
          onClick={() => {
            this.props.history.push('/users')
          }}
        >
          <strong>Users</strong>
        </Menu.Item>
      )
    }
  }

  renderSettingsItem() {
    if (this.props.user.is_super_admin) {
      return (
        <Menu.Item
          active={window.location.pathname === '/settings'}
          onClick={() => {
            this.props.history.push('/settings')
          }}
        >
          <strong>Settings</strong>
        </Menu.Item>
      )
    }
  }

  render() {
    return (
      <Menu fixed="top" inverted size="tiny">
        <Container>
          <Menu.Item>
            <Image
              spaced="right"
              src={logo}
              style={{ position: 'absolute', right: 0 }}
            />
          </Menu.Item>
          <Menu.Item
            active={window.location.pathname === '/'}
            onClick={() => {
              this.props.history.push('/')
            }}
          >
            <strong>Home</strong>
          </Menu.Item>
          {this.renderUsersItem()}
          {this.renderSettingsItem()}
          <Menu.Menu position="right">
            <Menu.Item>
              <Clock format="dddd, YY/MM/DD, HH:mm:ss" />
            </Menu.Item>
            {this.renderUserItem()}
          </Menu.Menu>
        </Container>
      </Menu>
    )
  }
}

Navigation.propTypes = {
  history: PropTypes.object.isRequired,
  user: PropTypes.shape({
    email: PropTypes.string,
    is_super_admin: PropTypes.bool.isRequired,
  }),
}
