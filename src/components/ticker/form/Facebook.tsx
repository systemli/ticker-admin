import { faFacebook } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { InputAdornment, TextField } from '@mui/material'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

const Facebook: FC = () => {
  const { control } = useFormContext()

  return (
    <Controller
      name="information.facebook"
      control={control}
      rules={{
        required: false,
        pattern: {
          value: /^([a-zA-Z0-9._]+)$/,
          message: 'Invalid Facebook username',
        },
      }}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start" style={{ marginRight: '0px' }}>
                  <FontAwesomeIcon icon={faFacebook} />
                  <span style={{ paddingLeft: '8px' }}>fb.com/</span>
                </InputAdornment>
              ),
            },
          }}
          error={!!error}
          helperText={error?.message ? error.message : null}
          label="Facebook"
          margin="dense"
        />
      )}
    />
  )
}

export default Facebook
