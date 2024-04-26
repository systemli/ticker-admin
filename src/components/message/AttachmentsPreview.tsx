import { ImageList } from '@mui/material'
import { FC } from 'react'
import { Upload } from '../../api/Upload'
import AttachmentPreview from './AttachmentPreview'

interface Props {
  attachments: Upload[]
  onDelete: (upload: Upload) => void
}

const AttachmentsPreview: FC<Props> = ({ attachments, onDelete }) => {
  const images = attachments.map((upload, key) => {
    return <AttachmentPreview key={key} onDelete={() => onDelete(upload)} upload={upload} />
  })

  if (images.length === 0) {
    return null
  }

  return (
    <ImageList cols={3} sx={{ mt: 1 }}>
      {images}
    </ImageList>
  )
}

export default AttachmentsPreview
