import React, { FC } from 'react'
import { Container, Message } from 'semantic-ui-react'
import Navigation from './Navigation'

const NotFoundView: FC = () => {
  return (
    <Container>
      <Navigation />
      <Container className="app">
        <Message>Not Found</Message>
      </Container>
    </Container>
  )
}

export default NotFoundView
