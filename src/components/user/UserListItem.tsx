import { faCheck, faPencil, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MoreVert } from '@mui/icons-material'
import { colors, IconButton, MenuItem, Popover, TableCell, TableRow, Typography } from '@mui/material'
import React, { FC, memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { User } from '../../api/User'
import dayjs from '../../lib/dayjs'
import UserModalDelete from './UserModalDelete'
import UserModalForm from './UserModalForm'

interface Props {
  user: User
}

const UserListItem: FC<Props> = ({ user }) => {
  const { t, i18n } = useTranslation()
  const [formModalOpen, setFormModalOpen] = useState<boolean>(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const normalizedLang = i18n.language.split('-')[0].toLowerCase()
  const dayjsLocale = ['en', 'de', 'fr'].includes(normalizedLang) ? normalizedLang : 'en'

  const emptyDate = '0001-01-01T00:00:00Z'
  const createdAt = dayjs(user.createdAt).locale(dayjsLocale).format('lll')
  const lastLogin = user.lastLogin !== emptyDate ? dayjs(user.lastLogin).locale(dayjsLocale).fromNow() : t('user.never')

  return (
    <TableRow hover>
      <TableCell align="center" padding="none">
        {user.id}
      </TableCell>
      <TableCell align="center" padding="none">
        {user.isSuperAdmin ? <FontAwesomeIcon aria-hidden="true" icon={faCheck} /> : <FontAwesomeIcon aria-hidden="true" icon={faXmark} />}
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{createdAt}</TableCell>
      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{lastLogin}</TableCell>
      <TableCell align="right">
        <IconButton aria-label={t('action.menu')} data-testid="usermenu" onClick={handleMenu} size="large">
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
            <FontAwesomeIcon aria-hidden="true" icon={faPencil} />
            <Typography sx={{ ml: 2 }}>{t('action.edit')}</Typography>
          </MenuItem>
          <MenuItem
            data-testid="usermenu-delete"
            onClick={() => {
              handleClose()
              setDeleteModalOpen(true)
            }}
            sx={{ color: colors.red[400] }}
          >
            <FontAwesomeIcon aria-hidden="true" icon={faTrash} />
            <Typography sx={{ ml: 2 }}>{t('action.delete')}</Typography>
          </MenuItem>
        </Popover>
        <UserModalForm onClose={() => setFormModalOpen(false)} open={formModalOpen} user={user} />
        <UserModalDelete onClose={() => setDeleteModalOpen(false)} open={deleteModalOpen} user={user} />
      </TableCell>
    </TableRow>
  )
}

export default memo(UserListItem)
