import React, { FC } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Ticker, useTickerApi } from '../../api/Ticker'
import { User, useUserApi } from '../../api/User'
import useAuth from '../useAuth'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

interface Props {
  ticker: Ticker
  onSubmit: () => void
  users: User[]
}

interface Option {
  key: number
  text: string
  value: number
}

interface FormValues {
  users: Array<number>
}

const TickerAddUserForm: FC<Props> = ({ onSubmit, ticker, users }) => {
  const { token } = useAuth()
  const { getUsers } = useUserApi(token)
  const { putTickerUsers } = useTickerApi(token)
  const { isLoading, data, error } = useQuery(
    ['tickerUsersAvailable'],
    getUsers
  )
  const { control, handleSubmit } = useForm<FormValues>()
  const queryClient = useQueryClient()

  const updateTickerUsers: SubmitHandler<FormValues> = data => {
    putTickerUsers(ticker, data.users).then(() => {
      queryClient.invalidateQueries(['tickerUsers', ticker.id])
      onSubmit()
    })
  }

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
    users !== null
      ? users.map(user => {
          return user.id
        })
      : []

  return (
    <form id="tickerUsersForm" onSubmit={handleSubmit(updateTickerUsers)}>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="users">Users</InputLabel>
        <Controller
          control={control}
          defaultValue={value}
          name="users"
          render={({ field }) => (
            <Select {...field} label="Users" multiple>
              {options.map(option => (
                <MenuItem key={option.key} value={option.value}>
                  {option.text}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </FormControl>
    </form>
  )
}

export default TickerAddUserForm
