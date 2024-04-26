import { ImageList, ImageListItem } from '@mui/material'
import { FC, useCallback, useState } from 'react'
import Lightbox from 'react-image-lightbox'
import { Message } from '../../api/Message'
import 'react-image-lightbox/style.css'

interface Props {
  message: Message
}

const MessageAttachements: FC<Props> = ({ message }) => {
  const [imageLightboxOpen, setImageLightboxOpen] = useState<boolean>(false)
  const [imageIndex, setImageIndex] = useState<number>(0)
  const attachments = message.attachments

  const openImageLightbox = useCallback(() => setImageLightboxOpen(true), [])
  const closeImageLightbox = useCallback(() => setImageLightboxOpen(false), [])

  if (attachments === null || attachments.length === 0) {
    return null
  }

  const images = attachments.map((image, key) => (
    <ImageListItem
      key={key}
      onClick={() => {
        openImageLightbox()
        setImageIndex(key)
      }}
      sx={{ position: 'relative' }}
    >
      <img
        src={image.url}
        style={{
          objectFit: 'cover',
        }}
      />
    </ImageListItem>
  ))
  const urls = attachments.map(image => image.url)

  return (
    <>
      {imageLightboxOpen && (
        <Lightbox
          mainSrc={urls[imageIndex]}
          nextSrc={urls[(imageIndex + 1) % urls.length]}
          onCloseRequest={closeImageLightbox}
          onMoveNextRequest={() => setImageIndex((imageIndex + 1) % urls.length)}
          onMovePrevRequest={() => setImageIndex((imageIndex + urls.length - 1) % urls.length)}
          prevSrc={urls[(imageIndex + urls.length - 1) % urls.length]}
        />
      )}
      <ImageList>{images}</ImageList>
    </>
  )
}

export default MessageAttachements
