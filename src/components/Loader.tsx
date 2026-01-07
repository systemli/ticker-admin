import { CircularProgress, Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

const Loader: FC = () => {
  const { t } = useTranslation()

  return (
    <Stack alignItems="center" justifyContent="center" sx={{ m: 10 }}>
      <CircularProgress size="3rem" />
      <Typography component="span" sx={{ pt: 2 }} variant="h5">
        {t('common.loading')}
      </Typography>
    </Stack>
  )
}

export default Loader
