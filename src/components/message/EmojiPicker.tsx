import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { faSmile } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, IconButton, Popper } from '@mui/material'
import React, { FC } from 'react'
import palette from '../../theme/palette'
import { Emoji } from './Emoji'

interface Props {
  color?: string
  disabled: boolean
  onChange: (emoji: Emoji) => void
}

const EmojiPicker: FC<Props> = ({ color, disabled, onChange }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleChange = (emoji: Emoji) => {
    onChange(emoji)
    setAnchorEl(null)
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
    event.stopPropagation()
  }

  const open = Boolean(anchorEl)
  color = color ?? palette.primary['main']
  const id = open ? 'simple-popper' : undefined

  return (
    <Box>
      <IconButton component="span" onClick={handleClick} style={{ marginRight: '8px' }} disabled={disabled}>
        <FontAwesomeIcon color={color} icon={faSmile} size="xs" />
      </IconButton>
      <Popper anchorEl={anchorEl} id={id} open={open}>
        <Picker data={data} onClickOutside={() => setAnchorEl(null)} onEmojiSelect={handleChange} theme="light" />
      </Popper>
    </Box>
  )
}

export default EmojiPicker
