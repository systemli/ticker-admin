import React, { FC, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { Ticker, useTickerApi } from '../../api/Ticker'
import { User, useUserApi } from '../../api/User'
import useAuth from '../useAuth'
import { Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, useTheme } from '@mui/material'

interface Props {
  ticker: Ticker
  onSubmit: () => void
  defaultValue: number[]
}

interface FormValues {
  users: Array<number>
}

const TickerUsersForm: FC<Props> = ({ onSubmit, ticker, defaultValue }) => {
  const [users, setUsers] = useState<Array<number>>(defaultValue)
  const [options, setOptions] = useState<Array<User>>([])
  const { token } = useAuth()
  const { getUsers } = useUserApi(token)
  const theme = useTheme()
  const { putTickerUsers } = useTickerApi(token)
  const { handleSubmit } = useForm<FormValues>()
  const queryClient = useQueryClient()

  const handleChange = (event: SelectChangeEvent<typeof users>) => {
    if (typeof event.target.value !== 'string') {
      setUsers(event.target.value)
    }
  }

  const updateTickerUsers: SubmitHandler<FormValues> = () => {
    putTickerUsers(ticker, users).then(() => {
      queryClient.invalidateQueries(['tickerUsers', ticker.id])
      onSubmit()
    })
  }

  useEffect(() => {
    getUsers()
      .then(response => response.data.users)
      .then(users =>
        setOptions(
          users.filter(user => {
            return !user.is_super_admin
          })
        )
      )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const renderValue = (selected: number[]) => {
    const selectedUsers = options.filter(user => {
      return selected.includes(user.id)
    })

    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {selectedUsers.map(user => (
          <Chip
            key={user.id}
            label={user.email}
            onDelete={() => {
              const reduced = users.filter(id => {
                return id !== user.id
              })
              setUsers(reduced)
            }}
            onMouseDown={e => {
              e.stopPropagation()
            }}
          />
        ))}
      </Box>
    )
  }

  const getStyle = (value: number, users: number[]) => {
    return {
      fontWeight: users.indexOf(value) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
    }
  }

  return (
    <form id="tickerUsersForm" onSubmit={handleSubmit(updateTickerUsers)}>
      <FormControl sx={{ width: '100%', mt: 1 }}>
        <InputLabel>Users</InputLabel>
        <Select input={<OutlinedInput label="Users" />} label="Users" multiple name="users" onChange={handleChange} renderValue={renderValue} value={users}>
          {options.map(user => (
            <MenuItem key={user.id} selected={users.includes(user.id)} style={getStyle(user.id, users)} value={user.id}>
              {user.email}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </form>
  )
}

export default TickerUsersForm
