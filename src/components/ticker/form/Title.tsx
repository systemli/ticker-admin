import { TextField } from '@mui/material'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

const Title: FC = () => {
  const { control } = useFormContext()

  return (
    <Controller
      name="title"
      control={control}
      rules={{
        required: 'Title is required',
        minLength: { value: 3, message: 'Title is too short' },
        maxLength: { value: 255, message: 'Title is too long' },
      }}
      render={({ field, fieldState: { error } }) => (
        <TextField {...field} error={!!error} helperText={error?.message ? error.message : null} label="Title" margin="dense" required />
      )}
    />
  )
}

export default Title
