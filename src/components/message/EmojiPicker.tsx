import React, { FC } from 'react'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { Emoji } from './Emoji'
import { Box, IconButton, Popper } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSmile } from '@fortawesome/free-solid-svg-icons'
import palette from '../../theme/palette'

interface Props {
  onChange: (emoji: Emoji) => void
}

const EmojiPicker: FC<Props> = ({ onChange }) => {
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
  const id = open ? 'simple-popper' : undefined

  return (
    <Box>
      <IconButton component="span" onClick={handleClick} style={{ marginRight: '8px' }}>
        <FontAwesomeIcon color={palette.primary['main']} icon={faSmile} size="xs" />
      </IconButton>
      <Popper anchorEl={anchorEl} id={id} open={open}>
        <Picker data={data} onClickOutside={() => setAnchorEl(null)} onEmojiSelect={handleChange} theme="light" />
      </Popper>
    </Box>
  )
}

export default EmojiPicker
