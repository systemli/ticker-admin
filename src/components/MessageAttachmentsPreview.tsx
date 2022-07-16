import React, { FC, useCallback } from 'react'
import { Button, ButtonProps, Image } from 'semantic-ui-react'
import { Upload } from '../api/Upload'

interface Props {
  attachments: Upload[]
  onDelete: (upload: Upload) => void
}

const MessageAttachmentsPreview: FC<Props> = props => {
  const onClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ButtonProps) => {
      const upload = data.upload as Upload
      props.onDelete(upload)
    },
    [props]
  )

  const images = props.attachments.map((upload, key) => {
    return (
      <div key={key} style={{ display: 'inline-block', position: 'relative' }}>
        <Image
          bordered
          src={upload.url}
          style={{ width: 150, height: 150, objectFit: 'cover' }}
        />
        <Button
          circular
          color="black"
          compact
          icon="delete"
          onClick={onClick}
          size="mini"
          style={{ position: 'absolute', right: 5, top: 5 }}
          type="button"
          upload={upload}
        />
      </div>
    )
  })

  if (images.length === 0) {
    return null
  }

  return <Image.Group>{images}</Image.Group>
}

export default MessageAttachmentsPreview
