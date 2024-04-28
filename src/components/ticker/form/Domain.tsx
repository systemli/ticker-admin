import { TextField } from '@mui/material'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

const Domain: FC = () => {
  const { control } = useFormContext()

  return <Controller name="domain" control={control} render={({ field }) => <TextField {...field} label="Domain" margin="dense" required />} />
}

export default Domain
