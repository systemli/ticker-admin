import { Refresh } from '@mui/icons-material'
import { Box, Button } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { FC, useState } from 'react'
import { Ticker } from '../../api/Ticker'
import { useTranslation } from 'react-i18next'

interface Props {
  ticker: Ticker
}

const MessageListReload: FC<Props> = ({ ticker }) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState<boolean>(false)
  const queryClient = useQueryClient()

  const handleClick = async () => {
    setLoading(true)
    await queryClient.invalidateQueries({ queryKey: ['messages', ticker.id] })
    setLoading(false)
  }

  return (
    <Box sx={{ textAlign: 'right' }}>
      <Button aria-label="reload" onClick={handleClick} size="small" startIcon={<Refresh />} loading={loading} loadingPosition="start">
        {t('message.reload')}
      </Button>
    </Box>
  )
}

export default MessageListReload
