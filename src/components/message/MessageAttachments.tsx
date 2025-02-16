import { ImageList, ImageListItem } from '@mui/material'
import { FC, useState } from 'react'
import { Message } from '../../api/Message'
import Lightbox from '../common/Lightbox'

interface Props {
  message: Message
}

const MessageAttachements: FC<Props> = ({ message }) => {
  const [open, setOpen] = useState<boolean>(false)
  const [currentImage, setCurrentImage] = useState<number>(0)
  const attachments = message.attachments || []

  const handleClick = (index: number) => {
    setCurrentImage(index)
    setOpen(true)
  }

  if (attachments === null || attachments.length === 0) {
    return null
  }

  return (
    <>
      <ImageList sx={{ mt: 1 }}>
        {attachments.map((image, key) => (
          <ImageListItem key={image.url} sx={{ position: 'relative' }} onClick={() => handleClick(key)}>
            <img src={image.url} alt={image.url} />
          </ImageListItem>
        ))}
      </ImageList>
      <Lightbox images={attachments.map(image => image.url)} initialImage={currentImage} open={open} onClose={() => setOpen(false)} />
    </>
  )
}

export default MessageAttachements
