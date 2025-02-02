import { Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, useTheme } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { FC, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Ticker, putTickerUsersApi } from '../../api/Ticker'
import { User, fetchUsersApi } from '../../api/User'
import useAuth from '../../contexts/useAuth'
import useNotification from '../../contexts/useNotification'

interface Props {
  ticker: Ticker
  onSubmit: () => void
  defaultValue: User[]
}

interface FormValues {
  users: Array<User>
}

const TickerUsersForm: FC<Props> = ({ onSubmit, ticker, defaultValue }) => {
  const { createNotification } = useNotification()
  const [users, setUsers] = useState<Array<User>>(defaultValue)
  const [options, setOptions] = useState<Array<User>>([])
  const { token } = useAuth()
  const theme = useTheme()
  const { handleSubmit } = useForm<FormValues>()
  const queryClient = useQueryClient()

  const handleChange = (event: SelectChangeEvent<number[]>) => {
    const userIds = event.target.value as Array<number>
    const selectedUsers = options.filter(user => {
      return userIds.includes(user.id)
    })
    setUsers(selectedUsers)
  }

  const updateTickerUsers: SubmitHandler<FormValues> = () => {
    putTickerUsersApi(token, ticker, users).then(() => {
      queryClient.invalidateQueries({ queryKey: ['tickerUsers', ticker.id] })
      createNotification({ content: 'Users were successfully updated', severity: 'success' })
      onSubmit()
    })
  }

  useEffect(() => {
    fetchUsersApi(token)
      .then(response => response.data?.users)
      .then(users => {
        if (!users) {
          return
        }

        setOptions(
          users.filter(user => {
            return !user.isSuperAdmin
          })
        )
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const renderValue = (selected: number[]) => {
    const selectedUsers = options.filter(user => {
      return selected.includes(user.id)
    })

    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {selectedUsers.map(selectedUser => (
          <Chip
            key={selectedUser.id}
            label={selectedUser.email}
            onDelete={() => {
              const reduced = users.filter(user => {
                return user.id !== selectedUser.id
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

  const getStyle = (value: User, users: User[]) => {
    const userIds = users.map(user => user.id)
    return {
      fontWeight: userIds.indexOf(value.id) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
    }
  }

  const userIds = users.map(user => user.id)

  return (
    <form id="tickerUsersForm" onSubmit={handleSubmit(updateTickerUsers)}>
      <FormControl sx={{ width: '100%', mt: 1 }}>
        <InputLabel>Users</InputLabel>
        <Select input={<OutlinedInput label="Users" />} label="Users" multiple name="users" onChange={handleChange} renderValue={renderValue} value={userIds}>
          {options.map(user => (
            <MenuItem key={user.id} selected={users.includes(user)} style={getStyle(user, users)} value={user.id}>
              {user.email}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </form>
  )
}

export default TickerUsersForm
