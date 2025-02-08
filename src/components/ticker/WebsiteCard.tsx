import { faGear, faGlobe, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button, Card, CardActions, CardContent, Divider, Link, Stack, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { FC, useState } from 'react'
import { handleApiCall } from '../../api/Api'
import { deleteTickerWebsitesApi, Ticker } from '../../api/Ticker'
import useAuth from '../../contexts/useAuth'
import useNotification from '../../contexts/useNotification'
import WebsiteModalForm from './WebsiteModalForm'

interface Props {
  ticker: Ticker
}

const WebsiteCard: FC<Props> = ({ ticker }) => {
  const { createNotification } = useNotification()
  const { token } = useAuth()
  const [open, setOpen] = useState<boolean>(false)

  const queryClient = useQueryClient()

  const websites = ticker.websites

  const handleDelete = () => {
    handleApiCall(deleteTickerWebsitesApi(token, ticker), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
        createNotification({ content: 'Websites integration successfully deleted', severity: 'success' })
      },
      onError: () => {
        createNotification({ content: 'Failed to delete Websites integration', severity: 'error' })
      },
      onFailure: error => {
        createNotification({ content: error as string, severity: 'error' })
      },
    })
  }

  const links = websites.map(website => (
    <Box component="span" key={website.id}>
      <Link href={website.origin} key={website.id}>
        {website.origin}
      </Link>
      {websites.indexOf(website) < websites.length - 1 ? ', ' : ''}
    </Box>
  ))

  return (
    <Card>
      <CardContent>
        <Stack alignItems="center" direction="row" justifyContent="space-between">
          <Typography component="h5" variant="h5">
            <FontAwesomeIcon icon={faGlobe} /> Websites
          </Typography>
          <Button onClick={() => setOpen(true)} size="small" startIcon={<FontAwesomeIcon icon={faGear} />}>
            Configure
          </Button>
        </Stack>
      </CardContent>
      <Divider variant="middle" />
      <CardContent>
        {websites.length > 0 ? (
          <Box>
            <Typography component="p" variant="body2">
              You have allowed the following websites to access your ticker: {links}
            </Typography>
          </Box>
        ) : (
          <Box>
            <Typography component="p" variant="body2">
              No website origins configured.
            </Typography>
            <Typography component="p" variant="body2">
              Without configured website origins, the ticker is not reachable from any website.
            </Typography>
          </Box>
        )}
      </CardContent>
      {websites.length > 0 ? (
        <CardActions>
          <Button onClick={handleDelete} startIcon={<FontAwesomeIcon icon={faTrash} />}>
            Delete
          </Button>
        </CardActions>
      ) : null}
      <WebsiteModalForm onClose={() => setOpen(false)} open={open} ticker={ticker} />
    </Card>
  )
}

export default WebsiteCard
