import { Container, Typography } from '@mui/material'
import { FC } from 'react'
import { Navigate, RouteProps } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Roles } from '../contexts/AuthContext'
import useAuth from '../contexts/useAuth'

type Props = RouteProps & {
  role: Roles
  outlet: JSX.Element
}

const ProtectedRoute: FC<Props> = ({ role, outlet }) => {
  const { t } = useTranslation()
  const { user } = useAuth()

  if (!user) {
    return <Navigate replace to="/login" />
  }

  if (!user.roles.includes(role)) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography component="h1" variant="h5">
          {t('error.permissionDenied')}
        </Typography>
      </Container>
    )
  }

  return outlet
}

export default ProtectedRoute
