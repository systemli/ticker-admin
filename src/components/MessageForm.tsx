import React, {
  ChangeEvent,
  FC,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { postMessage } from '../api/Message'
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

interface Props {
  ticker: Ticker
}

interface FormValues {
  message: string
}

export const MESSAGE_LIMIT = 280

const MessageForm: FC<Props> = ({ ticker }) => {
  const { handleSubmit, register, setValue, watch } = useForm<FormValues>()
  const queryClient = useQueryClient()
  const watchMessage = watch('message', '')

  const [errorMessage, setErrorMessage] = useState<string>('')

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
    postMessage(ticker.id.toString(), data.message, null, []).finally(() => {
      queryClient.invalidateQueries('messages')
    })
  }

  useEffect(() => {
    register('message')
  })

  // TODO: attachments + map

  return (
    <Form id="sendMessage" onSubmit={handleSubmit(onSubmit)}>
      <Form.Field>
        <Form.TextArea
          defaultValue=""
          name="message"
          onChange={onChange}
          placeholder="Write a message"
          rows="5"
        />
      </Form.Field>
      <Error
        content={errorMessage}
        header="Error"
        hidden={!errorMessage}
        icon="ban"
        negative
      />
      <Button
        color="teal"
        content="Send"
        disabled={errorMessage !== '' || watchMessage === ''}
        form="sendMessage"
        icon="send"
        type="submit"
      />
      <MessageFormCounter letterCount={watchMessage?.length || 0} />
    </Form>
  )
}

export default MessageForm
