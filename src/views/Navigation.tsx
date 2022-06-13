import React, { FC } from 'react'
import { Container, Dropdown, Image, Menu } from 'semantic-ui-react'
import Clock from '../components/Clock'
import AuthSingleton from '../components/AuthService'
import logo from '../assets/logo.png'
import { useHistory, useLocation } from 'react-router-dom'

const Auth = AuthSingleton.getInstance()

interface Props {
  user: any
}

const Navigation: FC<Props> = props => {
  const history = useHistory()
  const location = useLocation()

  const userItem = (
    <Dropdown item text={props.user.email}>
      <Dropdown.Menu>
        <Dropdown.Item
          onClick={() => {
            Auth.removeToken()
            history.push('/login')
          }}
        >
          Logout
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )

  const usersItem = (
    <Menu.Item
      active={location.pathname === '/users'}
      onClick={() => history.push('/users')}
    >
      <strong>Users</strong>
    </Menu.Item>
  )

  const settingsItem = (
    <Menu.Item
      active={location.pathname === '/settings'}
      onClick={() => history.push('/settings')}
    >
      <strong>Settings</strong>
    </Menu.Item>
  )

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
          onClick={() => history.push('/')}
        >
          <strong>Home</strong>
        </Menu.Item>
        {props.user?.is_super_admin ? usersItem : null}
        {props.user?.is_super_admin ? settingsItem : null}
        <Menu.Menu position="right">
          <Menu.Item>
            <Clock format="dddd, YY/MM/DD, HH:mm:ss" />
          </Menu.Item>
          {props.user ? userItem : null}
        </Menu.Menu>
      </Container>
    </Menu>
  )
}

export default Navigation
