import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Card, CardContent, Divider, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { UseQueryResult } from '@tanstack/react-query'
import { FC, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ApiResponse } from '../../api/Api'
import ErrorView from '../../views/ErrorView'
import Loader from '../Loader'

interface Props<T> {
  title: string
  description: string
  editTestId: string
  queryKey: string
  errorMessage: string
  query: UseQueryResult<ApiResponse<T>>
  children: (props: { data: T; formOpen: boolean; onFormClose: () => void }) => ReactNode
}

function SettingsCard<T>({ title, description, editTestId, queryKey, errorMessage, query, children }: Readonly<Props<T>>) {
  const { t } = useTranslation()
  const [formOpen, setFormOpen] = useState<boolean>(false)

  const { isLoading, error, data } = query

  if (isLoading) {
    return <Loader />
  }

  if (error || data === undefined || data.status === 'error' || data.data === undefined) {
    return <ErrorView queryKey={[queryKey]}>{errorMessage}</ErrorView>
  }

  return (
    <Card>
      <CardContent>
        <Stack alignItems="center" direction="row" justifyContent="space-between">
          <Typography component="h3" variant="h5">
            {t(title)}
          </Typography>
          <Button data-testid={editTestId} onClick={() => setFormOpen(true)} size="small" startIcon={<FontAwesomeIcon icon={faPencil} />}>
            {t('action.edit')}
          </Button>
        </Stack>
        <Typography color="GrayText" component="span" variant="body2">
          {t(description)}
        </Typography>
      </CardContent>
      <Divider variant="middle" />
      <CardContent>{children({ data: data.data, formOpen, onFormClose: () => setFormOpen(false) })}</CardContent>
    </Card>
  )
}

export default SettingsCard as <T>(props: Props<T>) => ReturnType<FC>
