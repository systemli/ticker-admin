import { FC } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconButton, ImageListItem } from '@mui/material'
import { Upload } from '../../api/Upload'
import { faXmarkSquare } from '@fortawesome/free-solid-svg-icons'

import { useTranslation } from 'react-i18next'

interface Props {
  onDelete: (upload: Upload) => void
  upload: Upload
}

const AttachmentPreview: FC<Props> = ({ onDelete, upload }) => {
  const { t } = useTranslation()
  const handleDelete = () => {
    onDelete(upload)
  }

  return (
    <ImageListItem sx={{ position: 'relative' }}>
      <img
        alt=""
        src={upload.url}
        style={{
          objectFit: 'cover',
        }}
      />
      <IconButton aria-label={t('action.delete')} onClick={handleDelete} sx={{ position: 'absolute', right: 0 }}>
        <FontAwesomeIcon icon={faXmarkSquare} />
      </IconButton>
    </ImageListItem>
  )
}

export default AttachmentPreview
