import React, { FC, useCallback, useState } from 'react'
import { AccountCircle } from '@mui/icons-material'
import { IconButton, Menu, MenuItem } from '@mui/material'
import useAuth from '../useAuth'

const UserDropdown: FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { user, logout } = useAuth()

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = useCallback(() => {
    logout()
  }, [logout])

  return (
    <>
      <IconButton onClick={handleMenu} size="large">
        <AccountCircle />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        onClose={handleClose}
        open={Boolean(anchorEl)}
        sx={{ mt: '45px' }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem disabled divider>
          {user?.email}
        </MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  )
}

export default UserDropdown
