import React, { FC, useState } from 'react'
import { useNavigate } from 'react-router'
import { Ticker } from '../../api/Ticker'
import useAuth from '../../contexts/useAuth'
import { colors, IconButton, MenuItem, Popover, TableCell, TableRow, Typography } from '@mui/material'
import { MoreVert } from '@mui/icons-material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faHandPointer, faPencil, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons'
import TickerModalDelete from './TickerModalDelete'
import TickerModalForm from './TickerModalForm'

interface Props {
  ticker: Ticker
}

const TickerListItem: FC<Props> = ({ ticker }: Props) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [formModalOpen, setFormModalOpen] = useState<boolean>(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleUse = () => {
    navigate(`/ticker/${ticker.id}`)
  }

  return (
    <TableRow hover style={{ cursor: 'pointer' }}>
      <TableCell align="center" onClick={handleUse} padding="none" size="small">
        {ticker.id}
      </TableCell>
      <TableCell align="center" onClick={handleUse} padding="none" size="small">
        {ticker.active ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faXmark} />}
      </TableCell>
      <TableCell onClick={handleUse}>{ticker.title}</TableCell>
      <TableCell onClick={handleUse}>{ticker.domain}</TableCell>
      <TableCell align="right">
        <IconButton data-testid="tickermenu" onClick={handleMenu} size="large">
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
            onClick={() => {
              handleClose()
              handleUse()
            }}
          >
            <FontAwesomeIcon icon={faHandPointer} />
            <Typography sx={{ ml: 2 }}>Use</Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose()
              setFormModalOpen(true)
            }}
          >
            <FontAwesomeIcon icon={faPencil} />
            <Typography sx={{ ml: 2 }}>Edit</Typography>
          </MenuItem>
          {user?.roles.includes('admin') ? (
            <>
              <MenuItem
                onClick={() => {
                  handleClose()
                  setDeleteModalOpen(true)
                }}
                sx={{ color: colors.red[400] }}
              >
                <FontAwesomeIcon icon={faTrash} />
                <Typography sx={{ ml: 2 }}>Delete</Typography>
              </MenuItem>
            </>
          ) : null}
        </Popover>
        <TickerModalForm onClose={() => setFormModalOpen(false)} open={formModalOpen} ticker={ticker} />
        <TickerModalDelete onClose={() => setDeleteModalOpen(false)} open={deleteModalOpen} ticker={ticker} />
      </TableCell>
    </TableRow>
  )
}

export default TickerListItem
