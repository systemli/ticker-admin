import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { InputAdornment, TextField } from '@mui/material'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

const Email: FC = () => {
  const { control } = useFormContext()

  return (
    <Controller
      name="information.email"
      control={control}
      rules={{
        required: false,
        pattern: {
          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          message: 'E-Mail is invalid',
        },
      }}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon icon={faEnvelope} />
              </InputAdornment>
            ),
          }}
          error={!!error}
          helperText={error?.message ? error.message : null}
          label="E-Mail"
          margin="dense"
        />
      )}
    />
  )
}

export default Email
