import React, { FC, useState } from 'react'
import { faCheck, faPencil, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MoreVert } from '@mui/icons-material'
import { colors, IconButton, MenuItem, Popover, TableCell, TableRow, Typography } from '@mui/material'
import { User } from '../../api/User'
import UserModalDelete from './UserModalDelete'
import UserModalForm from './UserModalForm'
import dayjs from 'dayjs'

interface Props {
  user: User
}

const UserListItem: FC<Props> = ({ user }) => {
  const [formModalOpen, setFormModalOpen] = useState<boolean>(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <TableRow hover>
      <TableCell align="center" padding="none">
        {user.id}
      </TableCell>
      <TableCell align="center" padding="none">
        {user.isSuperAdmin ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faXmark} />}
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{dayjs(user.createdAt).format('DD/MM/YYYY')}</TableCell>
      <TableCell align="right">
        <IconButton data-testid="usermenu" onClick={handleMenu} size="large">
          <MoreVert />
        </IconButton>
        <Popover
          PaperProps={{
            sx: {
              p: 1,
              width: 140,
              '& .MuiMenuItem-root': {
                px: 1,
                borderRadius: 0.75,
              },
            },
          }}
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          onClose={handleClose}
          open={Boolean(anchorEl)}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem
            data-testid="usermenu-edit"
            onClick={() => {
              handleClose()
              setFormModalOpen(true)
            }}
          >
            <FontAwesomeIcon icon={faPencil} />
            <Typography sx={{ ml: 2 }}>Edit</Typography>
          </MenuItem>
          <MenuItem
            data-testid="usermenu-delete"
            onClick={() => {
              handleClose()
              setDeleteModalOpen(true)
            }}
            sx={{ color: colors.red[400] }}
          >
            <FontAwesomeIcon icon={faTrash} />
            <Typography sx={{ ml: 2 }}>Delete</Typography>
          </MenuItem>
        </Popover>
        <UserModalForm onClose={() => setFormModalOpen(false)} open={formModalOpen} user={user} />
        <UserModalDelete onClose={() => setDeleteModalOpen(false)} open={deleteModalOpen} user={user} />
      </TableCell>
    </TableRow>
  )
}

export default UserListItem
