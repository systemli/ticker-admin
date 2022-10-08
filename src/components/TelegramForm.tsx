import React, { ChangeEvent, FC, FormEvent, useCallback } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import {
  CheckboxProps,
  Form,
  InputOnChangeData,
  Message,
} from 'semantic-ui-react'
import { Ticker, useTickerApi } from '../api/Ticker'
import useAuth from './useAuth'

interface Props {
  callback: () => void
  ticker: Ticker
}

interface FormValues {
  active: boolean
  channel_name: string
}

const TelegramForm: FC<Props> = ({ callback, ticker }) => {
  const telegram = ticker.telegram
  const { token } = useAuth()
  const { putTickerTelegram } = useTickerApi(token)
  const { handleSubmit, setValue } = useForm<FormValues>({
    defaultValues: {
      active: telegram.active,
      channel_name: telegram.channel_name,
    },
  })
  const queryClient = useQueryClient()

  const onChange = useCallback(
    (
      e: ChangeEvent | FormEvent,
      { name, value, checked }: InputOnChangeData | CheckboxProps
    ) => {
      if (checked !== undefined) {
        setValue(name, checked)
      } else {
        setValue(name, value)
      }
    },
    [setValue]
  )

  const onSubmit: SubmitHandler<FormValues> = data => {
    putTickerTelegram(data, ticker).finally(() => {
      queryClient.invalidateQueries(['ticker', ticker.id])
      callback()
    })
  }

  return (
    <Form id="configureTelegram" onSubmit={handleSubmit(onSubmit)}>
      <Message info size="small">
        <Message.Header>Information</Message.Header>
        <Message.Content>
          Only public Telegram Channels are supported. The name of the Channel
          is prefixed with an @ (e.g. @channel).
        </Message.Content>
      </Message>
      <Form.Checkbox
        defaultChecked={telegram.active}
        label="Active"
        name="active"
        onChange={onChange}
        toggle
      />
      <Form.Input
        defaultValue={telegram.channel_name}
        label="Channel"
        name="channel_name"
        onChange={onChange}
        required
      />
    </Form>
  )
}

export default TelegramForm
