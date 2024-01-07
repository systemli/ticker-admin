import { Alert } from '@mui/material'
import { FC } from 'react'
import Layout from './Layout'

const NotFoundView: FC = () => {
  return (
    <Layout>
      <Alert severity="error">Not found</Alert>
    </Layout>
  )
}

export default NotFoundView
