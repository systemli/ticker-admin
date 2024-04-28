import { TextField } from '@mui/material'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

const Title: FC = () => {
  const { control } = useFormContext()

  return <Controller name="title" control={control} render={({ field }) => <TextField {...field} label="Title" margin="dense" required />} />
}

export default Title
