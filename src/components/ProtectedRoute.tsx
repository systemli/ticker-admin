import React, { FC } from 'react'
import { Navigate, RouteProps } from 'react-router'
import useAuth, { Roles } from './useAuth'

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
      <React.Fragment>
        <h1>Permission denied</h1>
      </React.Fragment>
    )
  }

  return outlet
}

export default ProtectedRoute
