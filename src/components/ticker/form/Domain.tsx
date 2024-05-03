import { TextField } from '@mui/material'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import useAuth from '../../../contexts/useAuth'

const Domain: FC = () => {
  const { control } = useFormContext()
  const { user } = useAuth()

  return (
    <Controller
      name="domain"
      control={control}
      rules={{
        required: 'Domain is required',
      }}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          label="Domain"
          margin="dense"
          error={!!error}
          helperText={error?.message ? error.message : null}
          required
          disabled={!user?.roles.includes('admin')}
        />
      )}
    />
  )
}

export default Domain
