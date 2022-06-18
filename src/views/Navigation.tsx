import React, { FC, useCallback } from 'react'
import { Container, Dropdown, Image, Menu } from 'semantic-ui-react'
import Clock from '../components/Clock'
import logo from '../assets/logo.png'
import { useNavigate, useLocation } from 'react-router-dom'
import useAuth from '../components/useAuth'

const Navigation: FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const userItem = (
    <Dropdown item text={user?.email}>
      <Dropdown.Menu>
        <Dropdown.Item
          onClick={useCallback(() => {
            logout()
          }, [logout])}
        >
          Logout
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )

  const usersItem = (
    <Menu.Item
      active={location.pathname === '/users'}
      onClick={useCallback(() => navigate('/users'), [navigate])}
    >
      <strong>Users</strong>
    </Menu.Item>
  )

  const settingsItem = (
    <Menu.Item
      active={location.pathname === '/settings'}
      onClick={useCallback(() => navigate('/settings'), [navigate])}
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
          onClick={useCallback(() => navigate('/'), [navigate])}
        >
          <strong>Home</strong>
        </Menu.Item>
        {user?.roles.includes('admin') ? usersItem : null}
        {user?.roles.includes('admin') ? settingsItem : null}
        <Menu.Menu position="right">
          <Menu.Item>
            <Clock format="dddd, YY/MM/DD, HH:mm:ss" />
          </Menu.Item>
          {user ? userItem : null}
        </Menu.Menu>
      </Container>
    </Menu>
  )
}

export default Navigation
