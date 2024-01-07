import { Box, Button, Card, CardContent, colors, Divider, Stack, Typography } from '@mui/material'
import { QueryKey, useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'

interface Props {
  children: React.ReactNode
  queryKey: QueryKey
}

const ErrorView: FC<Props> = ({ children, queryKey }) => {
  const queryClient = useQueryClient()

  const handleClick = () => {
    queryClient.invalidateQueries(queryKey)
  }

  return (
    <Card>
      <CardContent>
        <Typography component="h2" variant="h4">
          Oh no! An error occured
        </Typography>
        <Divider sx={{ mt: 1, mb: 2 }} />
        <Stack alignItems="center" direction="row" spacing={2}>
          <Box>
            <Button color="secondary" onClick={handleClick} variant="contained">
              Reload
            </Button>
          </Box>
          <Box>
            <Typography variant="body1">{children}</Typography>
            <Typography color={colors.grey[700]} component="p" variant="body2">
              Please try again later or contact your administrator.
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ErrorView
