import { faImages } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconButton } from '@mui/material'
import { createRef, FC, useCallback } from 'react'
import { Ticker } from '../../api/Ticker'
import { postUploadApi, Upload } from '../../api/Upload'
import useAuth from '../../contexts/useAuth'
import palette from '../../theme/palette'

interface Props {
  ticker: Ticker
  onUpload: (uploads: Upload[]) => void
}

const UploadButton: FC<Props> = ({ onUpload, ticker }) => {
  const ref = createRef<HTMLInputElement>()
  const { token } = useAuth()

  const refClick = useCallback(() => {
    ref.current?.click()
  }, [ref])

  const handleUpload = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault()
    // @ts-expect-error files is not a property of Event
    const files = e.target.files as Array<FileList>
    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      // @ts-expect-error files is not a property of Event
      formData.append('files', files[i])
    }
    formData.append('ticker', ticker.id.toString())

    postUploadApi(token, formData).then(response => {
      if (response.status === 'error' || response.data === undefined || response.data.uploads === undefined) {
        return
      }
      onUpload(response.data.uploads)
    })
  }

  return (
    <>
      <IconButton onClick={refClick} sx={{ mr: 1 }}>
        <FontAwesomeIcon color={palette.primary['main']} icon={faImages} size="xs" />
      </IconButton>
      <input ref={ref} hidden multiple onChange={handleUpload} type="file" />
    </>
  )
}

export default UploadButton
