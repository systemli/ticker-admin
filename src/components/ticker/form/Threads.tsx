import { faThreads } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { InputAdornment, TextField } from '@mui/material'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

const Threads: FC = () => {
  const { control } = useFormContext()

  return (
    <Controller
      name="information.threads"
      control={control}
      rules={{
        required: false,
        pattern: {
          value: /^@([a-zA-Z0-9._]+)$/,
          message: 'Invalid Threads username. Must start with @',
        },
      }}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start" style={{ marginRight: '0px' }}>
                  <FontAwesomeIcon icon={faThreads} />
                  <span style={{ paddingLeft: '8px' }}>threads.net/</span>
                </InputAdornment>
              ),
            },
          }}
          error={!!error}
          helperText={error?.message ? error.message : null}
          label="Threads"
          margin="dense"
        />
      )}
    />
  )
}

export default Threads
