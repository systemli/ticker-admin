import React, { FC } from 'react'
import Modal from '../common/Modal'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { Emoji } from './Emoji'

interface Props {
  open: boolean
  onClose: () => void
  onChange: (emoji: Emoji) => void
}

const EmojiPickerModal: FC<Props> = ({ open, onClose, onChange }) => {
  const handleChange = (emoji: Emoji) => {
    onChange(emoji)
    onClose()
  }

  return (
    <Modal dialogContentSx={{ px: 0 }} onClose={onClose} open={open} title="Insert emoji">
      <Picker data={data} onClickOutside={() => onClose} onEmojiSelect={handleChange} />
    </Modal>
  )
}

export default EmojiPickerModal
