import { FC } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconButton, ImageListItem } from '@mui/material'
import { Upload } from '../../api/Upload'
import { faXmarkSquare } from '@fortawesome/free-solid-svg-icons'

interface Props {
  onDelete: (upload: Upload) => void
  upload: Upload
}

const AttachmentPreview: FC<Props> = ({ onDelete, upload }) => {
  const handleDelete = () => {
    onDelete(upload)
  }

  return (
    <ImageListItem sx={{ position: 'relative' }}>
      <img
        src={upload.url}
        style={{
          objectFit: 'cover',
        }}
      />
      <IconButton onClick={handleDelete} sx={{ position: 'absolute', right: 0 }}>
        <FontAwesomeIcon icon={faXmarkSquare} />
      </IconButton>
    </ImageListItem>
  )
}

export default AttachmentPreview
