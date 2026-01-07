import { Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, useTheme } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { FC, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { handleApiCall } from '../../api/Api'
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
  const { t } = useTranslation()
  const { createNotification } = useNotification()
  const [users, setUsers] = useState<Array<User>>(defaultValue)
  const [options, setOptions] = useState<Array<User>>([])
  const [open, setOpen] = useState(false)
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
    setOpen(false)
  }

  const updateTickerUsers: SubmitHandler<FormValues> = () => {
    handleApiCall(putTickerUsersApi(token, ticker, users), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tickerUsers', ticker.id] })
        createNotification({ content: t("user.updatedMultiple"), severity: 'success' })
        onSubmit()
      },
      onError: () => {
        createNotification({ content: t("user.errorUpdateMultiple"), severity: 'error' })
      },
      onFailure: error => {
        createNotification({ content: error as string, severity: 'error' })
      },
    })
  }

  useEffect(() => {
    handleApiCall(fetchUsersApi(token), {
      onSuccess: response => {
        const users = response.data?.users
        if (!users) {
          return
        }

        setOptions(
          users.filter(user => {
            return !user.isSuperAdmin
          })
        )
      },
      onError: () => {
        createNotification({ content: t("user.errorFetch"), severity: 'error' })
      },
      onFailure: error => {
        createNotification({ content: error as string, severity: 'error' })
      },
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
        <InputLabel>{t('title.users')}</InputLabel>
        <Select
          open={open}
          input={<OutlinedInput label={t('title.users')} />}
          label={t('title.users')}
          multiple
          name="users"
          onChange={handleChange}
          onClick={() => setOpen(!open)}
          renderValue={renderValue}
          value={userIds}
        >
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
