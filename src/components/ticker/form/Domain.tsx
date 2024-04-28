import { TextField } from '@mui/material'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import useAuth from '../../useAuth'

const Domain: FC = () => {
  const { control } = useFormContext()
  const { user } = useAuth()

  return (
    <Controller
      name="domain"
      control={control}
      render={({ field }) => <TextField {...field} label="Domain" margin="dense" required disabled={!user?.roles.includes('admin')} />}
    />
  )
}

export default Domain
