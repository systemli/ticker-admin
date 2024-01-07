import { FC } from 'react'
import { Box, Typography } from '@mui/material'

interface Props {
  title: string
  children: React.ReactNode
}

const NamedListItem: FC<Props> = ({ title, children }) => {
  return (
    <Box sx={{ mb: 1 }}>
      <Typography color="GrayText" component="span" variant="body2">
        {title}
      </Typography>
      {children}
    </Box>
  )
}

export default NamedListItem
