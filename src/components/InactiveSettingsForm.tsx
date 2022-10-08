import React, {
  ChangeEvent,
  FC,
  FormEvent,
  useCallback,
  useEffect,
} from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import {
  Form,
  Header,
  InputOnChangeData,
  TextAreaProps,
} from 'semantic-ui-react'
import { InactiveSetting, Setting, useSettingsApi } from '../api/Settings'
import useAuth from './useAuth'

interface Props {
  setting: Setting<InactiveSetting>
  callback: () => void
}

interface FormValues {
  headline: string
  sub_headline: string
  description: string
  author: string
  email: string
  homepage: string
  twitter: string
}

const InactiveSettingsForm: FC<Props> = props => {
  const setting = props.setting
  const { handleSubmit, register, setValue } = useForm<FormValues>({
    defaultValues: {
      headline: setting.value.headline,
      sub_headline: setting.value.sub_headline,
      description: setting.value.description,
      author: setting.value.author,
      email: setting.value.email,
      homepage: setting.value.homepage,
      twitter: setting.value.twitter,
    },
  })
  const { token } = useAuth()
  const { putInactiveSettings } = useSettingsApi(token)
  const queryClient = useQueryClient()

  const onChange = useCallback(
    (
      e: FormEvent | ChangeEvent,
      { name, value }: InputOnChangeData | TextAreaProps
    ) => {
      setValue(name, value)
    },
    [setValue]
  )

  const onSubmit: SubmitHandler<FormValues> = data => {
    putInactiveSettings(data)
      .then(() => queryClient.invalidateQueries(['inactive_settings']))
      .finally(() => props.callback())
  }

  useEffect(() => {
    register('headline')
    register('sub_headline')
    register('description')
    register('author')
    register('email')
    register('homepage')
    register('twitter')
  })

  return (
    <Form id="inactiveSettingsForm" onSubmit={handleSubmit(onSubmit)}>
      <Form.Group widths="equal">
        <Form.Input
          defaultValue={setting.value.headline}
          label="Headline"
          name="headline"
          onChange={onChange}
        />
        <Form.Input
          defaultValue={setting.value.sub_headline}
          label="Subheadline"
          name="sub_headline"
          onChange={onChange}
        />
      </Form.Group>
      <Form.TextArea
        defaultValue={setting.value.description}
        label="Description"
        name="description"
        onChange={onChange}
        rows="5"
      />
      <Header dividing>Information</Header>
      <Form.Group widths="equal">
        <Form.Input
          defaultValue={setting.value.author}
          icon="users"
          iconPosition="left"
          label="Author"
          name="author"
          onChange={onChange}
          placeholder="Author"
        />
        <Form.Input
          defaultValue={setting.value.homepage}
          icon="home"
          iconPosition="left"
          label="Homepage"
          name="homepage"
          onChange={onChange}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Input
          defaultValue={setting.value.email}
          icon="at"
          iconPosition="left"
          label="Email"
          name="email"
          onChange={onChange}
          placeholder="Email"
        />
        <Form.Input
          defaultValue={setting.value.twitter}
          icon="twitter"
          iconPosition="left"
          label="Twitter"
          name="twitter"
          onChange={onChange}
        />
      </Form.Group>
    </Form>
  )
}

export default InactiveSettingsForm
