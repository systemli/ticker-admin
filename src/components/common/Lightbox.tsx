import { faArrowLeft, faArrowRight, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, IconButton, Modal } from '@mui/material'
import { FC, useEffect, useState } from 'react'

interface Props {
  open: boolean
  images: string[]
  initialImage?: number
  onClose: () => void
}

const Lightbox: FC<Props> = ({ images, initialImage = 0, open, onClose }) => {
  const [currentImage, setCurrentImage] = useState<number>(initialImage)

  const handlePrev = () => {
    setCurrentImage(prevIndex => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const handleNext = () => {
    setCurrentImage(prevIndex => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev()
      } else if (e.key === 'ArrowRight') {
        handleNext()
      } else if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, images.length, onClose])

  return (
    <Modal open={open} onClose={onClose} disableEscapeKeyDown>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <img alt={images[currentImage]} src={images[currentImage]} style={{ maxWidth: '100%', maxHeight: '100%' }} />
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: -42, right: -42 }} color="primary" aria-label="close">
          <FontAwesomeIcon icon={faXmark} />
        </IconButton>
        {images.length > 1 && (
          <>
            <IconButton onClick={handlePrev} sx={{ position: 'absolute', top: '50%', left: -42 }} color="primary" aria-label="previous">
              <FontAwesomeIcon icon={faArrowLeft} />
            </IconButton>
            <IconButton onClick={handleNext} sx={{ position: 'absolute', top: '50%', right: -42 }} color="primary" aria-label="next">
              <FontAwesomeIcon icon={faArrowRight} />
            </IconButton>
          </>
        )}
      </Box>
    </Modal>
  )
}

export default Lightbox
