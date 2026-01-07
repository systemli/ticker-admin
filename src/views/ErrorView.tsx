import { Box, Button, Card, CardContent, colors, Divider, Stack, Typography } from '@mui/material'
import { QueryKey, useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  children: React.ReactNode
  queryKey: QueryKey
}

const ErrorView: FC<Props> = ({ children, queryKey }) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const handleClick = () => {
    queryClient.invalidateQueries({ queryKey: queryKey })
  }

  return (
    <Card>
      <CardContent>
        <Typography component="h2" variant="h4">
          {t('error.ohNo')}
        </Typography>
        <Divider sx={{ mt: 1, mb: 2 }} />
        <Stack alignItems="center" direction="row" spacing={2}>
          <Box>
            <Button color="secondary" onClick={handleClick} variant="contained">
              {t('action.reload')}
            </Button>
          </Box>
          <Box>
            <Typography component="div" variant="body1">
              {children}
            </Typography>
            <Typography color={colors.grey[700]} component="p" variant="body2">
              {t('error.contactAdmin')}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ErrorView
