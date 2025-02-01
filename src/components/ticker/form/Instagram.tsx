import { faInstagram } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { InputAdornment, TextField } from '@mui/material'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

const Instagram: FC = () => {
  const { control } = useFormContext()

  return (
    <Controller
      name="information.instagram"
      control={control}
      rules={{
        required: false,
        pattern: {
          value: /^([a-zA-Z0-9._]+)$/,
          message: 'Invalid Instagram username.',
        },
      }}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" style={{ marginRight: '0px' }}>
                <FontAwesomeIcon icon={faInstagram} />
                <span style={{ paddingLeft: '8px' }}>instagram.com/</span>
              </InputAdornment>
            ),
          }}
          error={!!error}
          helperText={error?.message ? error.message : null}
          label="Instagram"
          margin="dense"
        />
      )}
    />
  )
}

export default Instagram
