import { CircularProgress, Stack, Typography } from '@mui/material'
import { FC } from 'react'

const Loader: FC = () => {
  return (
    <Stack alignItems="center" justifyContent="center" sx={{ m: 10 }}>
      <CircularProgress size="3rem" />
      <Typography component="span" sx={{ pt: 2 }} variant="h5">
        Loading
      </Typography>
    </Stack>
  )
}

export default Loader
