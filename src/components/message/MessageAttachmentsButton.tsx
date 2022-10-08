import React, { createRef, FC, useCallback } from 'react'
import { Button } from 'semantic-ui-react'
import { Ticker } from '../../api/Ticker'
import { useUploadApi, Upload } from '../../api/Upload'
import useAuth from '../useAuth'

interface Props {
  ticker: Ticker
  onUpload: (uploads: Upload[]) => void
}

const MessageAttachmentsButton: FC<Props> = props => {
  const ref = createRef<HTMLInputElement>()
  const { token } = useAuth()
  const { postUpload } = useUploadApi(token)

  const refClick = useCallback(() => {
    ref.current?.click()
  }, [ref])

  const onUpload = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      e.preventDefault()
      // @ts-ignore
      const files = e.target.files as Array<FileList>
      const formData = new FormData()
      for (let i = 0; i < files.length; i++) {
        // @ts-ignore
        formData.append('files', files[i])
      }
      formData.append('ticker', props.ticker.id.toString())

      postUpload(formData).then(response => {
        props.onUpload(response.data.uploads)
      })
    },
    [postUpload, props]
  )

  return (
    <React.Fragment>
      <Button
        color="violet"
        content="Add Media"
        icon="images outline"
        onClick={refClick}
        type="button"
      />
      <input ref={ref} hidden multiple onChange={onUpload} type="file" />
    </React.Fragment>
  )
}

export default MessageAttachmentsButton
