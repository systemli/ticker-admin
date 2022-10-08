import React, {
  ChangeEvent,
  FC,
  FormEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
} from 'react'
import {
  CheckboxProps,
  DropdownProps,
  Form,
  Header,
  InputOnChangeData,
} from 'semantic-ui-react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { User, useUserApi } from '../api/User'
import { useQueryClient } from '@tanstack/react-query'
import TickersDropdown from './TickersDropdown'
import useAuth from './useAuth'

interface Props {
  user?: User
  callback: () => void
}

interface FormValues {
  email: string
  is_super_admin: boolean
  password: string
  password_validate: string
  tickers: Array<number>
}

const UserForm: FC<Props> = props => {
  const user = props.user
  const { token } = useAuth()
  const { postUser, putUser } = useUserApi(token!)
  const { handleSubmit, register, setValue } = useForm<FormValues>({
    defaultValues: {
      email: user?.email,
      is_super_admin: user?.is_super_admin,
    },
  })
  const queryClient = useQueryClient()

  const onChange = useCallback(
    (
      e: ChangeEvent | FormEvent | SyntheticEvent,
      {
        name,
        value,
        checked,
      }: InputOnChangeData | CheckboxProps | DropdownProps
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
    const formData = {
      email: data.email,
      is_super_admin: data.is_super_admin,
      password: data.password,
      tickers: data.tickers,
    }

    if (user) {
      putUser(formData, user).finally(() => {
        queryClient.invalidateQueries(['users'])
        props.callback()
      })
    } else {
      postUser(formData).finally(() => {
        queryClient.invalidateQueries(['users'])
        props.callback()
      })
    }
  }

  useEffect(() => {
    register('email')
    register('is_super_admin')
    register('password')
    register('password_validate')
    register('tickers')
  })

  return (
    <Form id="userForm" onSubmit={handleSubmit(onSubmit)}>
      <Form.Group widths="2">
        <Form.Input
          defaultValue={user ? user.email : ''}
          label="Email"
          name="email"
          onChange={onChange}
          required
        />
      </Form.Group>
      <Form.Checkbox
        defaultChecked={user ? user.is_super_admin : false}
        label="Super Admin"
        name="is_super_admin"
        onChange={onChange}
        toggle
      />
      <Form.Group widths="equal">
        <Form.Input
          label="Password"
          name="password"
          onChange={onChange}
          type="password"
        />
        <Form.Input
          label="Repeat Password"
          name="password_validate"
          onChange={onChange}
          type="password"
        />
      </Form.Group>
      {!user?.is_super_admin ? (
        <>
          <Header>Permissions</Header>
          <TickersDropdown
            defaultValue={user?.tickers}
            name="tickers"
            onChange={onChange}
          />
        </>
      ) : null}
    </Form>
  )
}

export default UserForm
