import { AccountCircle } from '@mui/icons-material'
import { IconButton, Menu, MenuItem } from '@mui/material'
import React, { FC, useCallback, useState } from 'react'
import useAuth from '../../contexts/useAuth'
import useNotification from '../../contexts/useNotification'
import UserChangePasswordModalForm from '../user/UserChangePasswordModalForm'

const UserDropdown: FC = () => {
  const [formModalOpen, setFormModalOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { user, logout } = useAuth()
  const { createNotification } = useNotification()

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = useCallback(() => {
    logout()
    createNotification({ content: 'You have been logged out' })
  }, [createNotification, logout])

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
        <MenuItem
          divider
          onClick={() => {
            handleClose()
            setFormModalOpen(true)
          }}
        >
          Change Password
        </MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
      <UserChangePasswordModalForm onClose={() => setFormModalOpen(false)} open={formModalOpen} />
    </>
  )
}

export default UserDropdown
