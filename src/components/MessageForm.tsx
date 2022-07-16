import React, {
  ChangeEvent,
  FC,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useMessageApi } from '../api/Message'
import {
  Button,
  Form,
  Message as Error,
  TextAreaProps,
} from 'semantic-ui-react'
import { Ticker } from '../api/Ticker'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useQueryClient } from 'react-query'
import MessageFormCounter from './MessageFormCounter'
import useAuth from './useAuth'
import { Upload } from '../api/Upload'
import MessageAttachmentsButton from './MessageAttachmentsButton'
import MessageAttachmentsPreview from './MessageAttachmentsPreview'
import MessageMapModal from './MessageMapModal'
import { FeatureCollection, Geometry } from 'geojson'

interface Props {
  ticker: Ticker
}

interface FormValues {
  message: string
}

export const MESSAGE_LIMIT = 280

const MessageForm: FC<Props> = ({ ticker }) => {
  const {
    formState: { isSubmitSuccessful },
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<FormValues>()
  const { token } = useAuth()
  const { postMessage } = useMessageApi(token)
  const queryClient = useQueryClient()
  const watchMessage = watch('message', '')
  const [attachments, setAttachments] = useState<Upload[]>([])
  const emptyMap: FeatureCollection<Geometry, any> = {
    type: 'FeatureCollection',
    features: [],
  }
  const [map, setMap] = useState<FeatureCollection<Geometry, any>>(emptyMap)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const onUpload = useCallback(
    (uploads: Upload[]) => {
      setAttachments(attachments.concat(uploads))
    },
    [attachments]
  )

  const onUploadDelete = useCallback(
    (upload: Upload) => {
      setAttachments(
        attachments.filter((attachment: Upload) => {
          if (attachment.id !== upload.id) {
            return true
          }
        })
      )
    },
    [attachments]
  )

  const onMapUpdate = useCallback(
    (featureGroups: FeatureCollection<Geometry, any>) => {
      setMap(featureGroups)
    },
    []
  )

  const onChange = useCallback(
    (e: ChangeEvent | FormEvent, { name, value }: TextAreaProps) => {
      setValue(name, value)
      if (watchMessage?.length > MESSAGE_LIMIT) {
        setErrorMessage(
          `The message is too long. You must remove ${
            watchMessage?.length - MESSAGE_LIMIT
          } characters.`
        )
      } else if (errorMessage !== '') {
        setErrorMessage('')
      }
    },
    [errorMessage, setValue, watchMessage?.length]
  )

  const onSubmit: SubmitHandler<FormValues> = data => {
    const uploads = attachments.map(upload => {
      return upload.id
    })

    postMessage(ticker.id.toString(), data.message, map, uploads).finally(
      () => {
        queryClient.invalidateQueries(['messages', ticker.id])
        setAttachments([])
      }
    )
  }

  useEffect(() => {
    reset({
      message: '',
    })
  }, [isSubmitSuccessful, reset])

  return (
    <Form id="sendMessage" onSubmit={handleSubmit(onSubmit)}>
      <Form.Field>
        <Form.TextArea
          name="message"
          onChange={onChange}
          placeholder="Write a message"
          rows="5"
          value={watchMessage}
        />
      </Form.Field>
      <Error
        content={errorMessage}
        header="Error"
        hidden={!errorMessage}
        icon="ban"
        negative
      />
      <MessageAttachmentsPreview
        attachments={attachments}
        onDelete={onUploadDelete}
      />
      <Button
        color="teal"
        content="Send"
        disabled={errorMessage !== '' || watchMessage === ''}
        form="sendMessage"
        icon="send"
        type="submit"
      />
      <MessageAttachmentsButton onUpload={onUpload} ticker={ticker} />
      <MessageMapModal
        callback={onMapUpdate}
        map={map}
        ticker={ticker}
        trigger={
          <Button color="orange" content="Add Map" toggle type="button" />
        }
      />
      <MessageFormCounter letterCount={watchMessage?.length || 0} />
    </Form>
  )
}

export default MessageForm
