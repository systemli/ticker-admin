import { Box, Button, colors } from '@mui/material'
import React, { FC } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  active: boolean
  icon: React.ReactNode
  title: string
  to: string
}

const NavItem: FC<Props> = ({ active, icon, title, to }) => {
  return (
    <Link to={to}>
      <Button
        size="large"
        sx={{
          mx: 1,
          px: 4,
          backgroundColor: active ? colors.blue[50] : colors.grey[100],
          borderRadius: 4,
          color: colors.common['black'],
          fontSize: '1rem',
        }}
      >
        <Box sx={{ mr: 1 }}>{icon}</Box>
        {title}
      </Button>
    </Link>
  )
}

export default NavItem
