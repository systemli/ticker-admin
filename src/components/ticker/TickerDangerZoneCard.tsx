import React, { FC, useState } from 'react'
import { Box, Button, Card, CardContent, Typography } from '@mui/material'
import { Ticker } from '../../api/Ticker'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBiohazard, faTrash } from '@fortawesome/free-solid-svg-icons'
import TickerResetModal from './TickerResetModal'
import useAuth from '../useAuth'

interface Props {
  ticker: Ticker
}
const TickerDangerZoneCard: FC<Props> = ({ ticker }) => {
  const { user } = useAuth()
  const [resetOpen, setResetOpen] = useState<boolean>(false)

  return user?.roles.includes('admin') ? (
    <Card>
      <CardContent>
        <Typography component="h5" sx={{ mb: 2 }} variant="h5">
          <FontAwesomeIcon icon={faBiohazard} /> Danger Zone
        </Typography>
        <Box>
          <Button
            color="error"
            onClick={() => setResetOpen(true)}
            startIcon={<FontAwesomeIcon icon={faTrash} />}
            variant="outlined"
          >
            Reset Ticker
          </Button>
          <TickerResetModal
            onClose={() => setResetOpen(false)}
            open={resetOpen}
            ticker={ticker}
          />
        </Box>
      </CardContent>
    </Card>
  ) : null
}

export default TickerDangerZoneCard
