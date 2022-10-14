import { useQueryClient } from '@tanstack/react-query'
import React, { ChangeEvent, FC, FormEvent, useCallback } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { CheckboxProps, Form, InputOnChangeData } from 'semantic-ui-react'
import { Ticker, TickerMastodonFormData, useTickerApi } from '../../api/Ticker'
import useAuth from '../useAuth'

interface Props {
  callback: () => void
  ticker: Ticker
}

const MastodonForm: FC<Props> = ({ callback, ticker }) => {
  const mastodon = ticker.mastodon
  const { token } = useAuth()
  const { putTickerMastodon } = useTickerApi(token)
  const { handleSubmit, setValue } = useForm<TickerMastodonFormData>({
    defaultValues: {
      active: mastodon.active,
      server: mastodon.server,
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

  const onSubmit: SubmitHandler<TickerMastodonFormData> = data => {
    putTickerMastodon(data, ticker).finally(() => {
      queryClient.invalidateQueries(['ticker', ticker.id])
      callback()
    })
  }

  return (
    <Form id="configureMastodon" onSubmit={handleSubmit(onSubmit)}>
      <Form.Checkbox
        defaultChecked={mastodon.active}
        label="Active"
        name="active"
        onChange={onChange}
        toggle
      />
      <Form.Input
        defaultValue={mastodon.server}
        label="Server"
        name="server"
        onChange={onChange}
        placeholder="https://mastodon.social"
        required
      />
      <Form.Input
        label="Token"
        name="token"
        onChange={onChange}
        required
        type="password"
      />
      <Form.Input
        label="Secret"
        name="secret"
        onChange={onChange}
        required
        type="password"
      />
      <Form.Input
        label="Access Token"
        name="access_token"
        onChange={onChange}
        required
        type="password"
      />
    </Form>
  )
}

export default MastodonForm
