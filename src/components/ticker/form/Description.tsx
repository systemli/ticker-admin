import { TextField } from '@mui/material'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

const Description: FC = () => {
  const { control } = useFormContext()

  return (
    <Controller
      name="description"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField {...field} error={!!error} helperText={error?.message ? error.message : null} margin="dense" maxRows={10} multiline label="Description" />
      )}
    />
  )
}

export default Description
