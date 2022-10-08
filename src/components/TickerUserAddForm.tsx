import React, { FC, useCallback, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Dropdown, DropdownProps, Form } from 'semantic-ui-react'
import { Ticker, useTickerApi } from '../api/Ticker'
import { User, useUserApi } from '../api/User'
import useAuth from './useAuth'

interface Props {
  ticker: Ticker
  callback: () => void
  users: User[] | null
}

interface Option {
  key: number
  text: string
  value: number
}

interface FormValues {
  users: Array<number>
}

const TickerUserAddForm: FC<Props> = props => {
  const { token } = useAuth()
  const { getUsers } = useUserApi(token)
  const { putTickerUsers } = useTickerApi(token)
  const { isLoading, data, error } = useQuery(
    ['tickerUsersAvailable'],
    getUsers
  )
  const { handleSubmit, register, setValue } = useForm<FormValues>()
  const queryClient = useQueryClient()

  const onSubmit: SubmitHandler<FormValues> = data => {
    putTickerUsers(props.ticker, data.users).then(() => {
      queryClient.invalidateQueries(['tickerUsers', props.ticker.id])
      props.callback()
    })
  }

  const handleChange = useCallback(
    (event: React.SyntheticEvent, data: DropdownProps) => {
      // @ts-ignore
      setValue('users', data.value)
    },
    [setValue]
  )

  useEffect(() => {
    register('users')
  })

  if (isLoading) {
    return <>Loading</>
  }

  if (error || data === undefined) {
    return <>error</>
  }

  const options: Array<Option> = data.data.users
    .filter(user => {
      return !user.is_super_admin
    })
    .map(user => {
      return { key: user.id, text: user.email, value: user.id }
    })

  const value: number[] =
    props.users !== null
      ? props.users.map(user => {
          return user.id
        })
      : []

  return (
    <Form id="tickerUsersForm" onSubmit={handleSubmit(onSubmit)}>
      <Dropdown
        defaultValue={value}
        fluid
        multiple
        name="users"
        onChange={handleChange}
        options={options}
        selection
      />
    </Form>
  )
}

export default TickerUserAddForm
