import { Alert } from '@mui/material'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Layout from './Layout'

const NotFoundView: FC = () => {
  const { t } = useTranslation()
  return (
    <Layout>
      <Alert severity="error">{t('error.notFound')}</Alert>
    </Layout>
  )
}

export default NotFoundView
