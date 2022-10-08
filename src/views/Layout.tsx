import React, { FC } from 'react'
import { Container } from 'semantic-ui-react'
import Navigation from '../components/navigation/Navigation'

interface Props {
  children: React.ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <Container>
      <Navigation />
      <Container className="app">{children}</Container>
    </Container>
  )
}

export default Layout
