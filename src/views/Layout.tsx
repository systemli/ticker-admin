import { FC } from 'react'
import { Box, Container } from '@mui/material'
import Nav from '../components/navigation/Nav'
import NavItem from '../components/navigation/NavItem'
import UserDropdown from '../components/navigation/UserDropdown'
import useAuth from '../contexts/useAuth'
import { useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGaugeHigh, faGears, faUsers } from '@fortawesome/free-solid-svg-icons'

interface Props {
  children: React.ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  const { user } = useAuth()
  const location = useLocation()

  return (
    <>
      <Nav>
        <Box sx={{ flexGrow: 1 }}>
          <NavItem active={location.pathname === '/'} icon={<FontAwesomeIcon icon={faGaugeHigh} />} title="Dashboard" to="/" />
          {!user?.roles.includes('admin') || (
            <NavItem active={location.pathname === '/users'} icon={<FontAwesomeIcon icon={faUsers} />} title="Users" to="/users" />
          )}
          {!user?.roles.includes('admin') || (
            <NavItem active={location.pathname === '/settings'} icon={<FontAwesomeIcon icon={faGears} />} title="Settings" to="/settings" />
          )}
        </Box>
        <Box>
          <UserDropdown />
        </Box>
      </Nav>
      <Container fixed sx={{ mb: 4 }}>
        {children}
      </Container>
    </>
  )
}

export default Layout
