import { FC } from 'react'
import { Navigate, RouteProps } from 'react-router'
import useAuth from '../contexts/useAuth'
import { Roles } from '../contexts/AuthContext'

type Props = RouteProps & {
  role: Roles
  outlet: JSX.Element
}

const ProtectedRoute: FC<Props> = ({ role, outlet }) => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate replace to="/login" />
  }

  if (!user.roles.includes(role)) {
    //TODO: ErrorView
    return (
      <>
        <h1>Permission denied</h1>
      </>
    )
  }

  return outlet
}

export default ProtectedRoute
