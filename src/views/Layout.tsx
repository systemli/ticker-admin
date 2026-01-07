import { faGaugeHigh, faGears, faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Container } from '@mui/material'
import { FC } from 'react'
import { useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import Nav from '../components/navigation/Nav'
import NavItem from '../components/navigation/NavItem'
import UserDropdown from '../components/navigation/UserDropdown'
import useAuth from '../contexts/useAuth'

interface Props {
  children: React.ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const location = useLocation()

  return (
    <>
      <Nav>
        <Box sx={{ flexGrow: 1 }}>
          <NavItem active={location.pathname === '/'} icon={<FontAwesomeIcon icon={faGaugeHigh} />} title={t('title.dashboard')} to="/" />
          {user?.roles.includes('admin') && (
            <NavItem active={location.pathname === '/users'} icon={<FontAwesomeIcon icon={faUsers} />} title={t('title.users')} to="/users" />
          )}
          {user?.roles.includes('admin') && (
            <NavItem active={location.pathname === '/settings'} icon={<FontAwesomeIcon icon={faGears} />} title={t('title.settings')} to="/settings" />
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
