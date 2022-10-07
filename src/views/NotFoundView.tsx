import React, { FC } from 'react'
import { Message } from 'semantic-ui-react'
import Layout from './Layout'

const NotFoundView: FC = () => {
  return (
    <Layout>
      <Message>Not Found</Message>
    </Layout>
  )
}

export default NotFoundView
