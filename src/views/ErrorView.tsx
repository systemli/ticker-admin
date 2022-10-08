import React, { FC } from 'react'
import { Icon, Message } from 'semantic-ui-react'

interface Props {
  children: React.ReactNode
}

const ErrorView: FC<Props> = ({ children }) => {
  return (
    <Message error icon>
      <Icon name="thumbs down outline" />
      <Message.Content>
        <Message.Header>Oh no! An error occured</Message.Header>
        <p>{children}</p>
        <p>
          <small>Please try again later or contact your administrator.</small>
        </p>
      </Message.Content>
    </Message>
  )
}

export default ErrorView
