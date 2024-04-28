import { faComputerMouse } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { InputAdornment, TextField } from '@mui/material'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

const Url: FC = () => {
  const { control } = useFormContext()

  return (
    <Controller
      name="information.url"
      control={control}
      rules={{
        required: false,
        pattern: {
          value: /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(:\d{1,5})?(\/.*)?$/i,
          message: 'Homepage is invalid',
        },
      }}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon icon={faComputerMouse} />
              </InputAdornment>
            ),
          }}
          error={!!error}
          helperText={error?.message ? error.message : null}
          label="Homepage"
          margin="dense"
        />
      )}
    />
  )
}

export default Url
