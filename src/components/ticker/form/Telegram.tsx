import { faTelegram } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { InputAdornment, TextField } from '@mui/material'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

const Telegram: FC = () => {
  const { control } = useFormContext()

  return (
    <Controller
      name="information.telegram"
      control={control}
      rules={{
        required: false,
        pattern: {
          value: /^\w{5,32}$/,
          message: 'Invalid Telegram username',
        },
      }}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start" style={{ marginRight: '0px' }}>
                  <FontAwesomeIcon icon={faTelegram} />
                  <span style={{ paddingLeft: '8px' }}>t.me/</span>
                </InputAdornment>
              ),
            },
          }}
          error={!!error}
          helperText={error?.message ? error.message : null}
          label="Telegram"
          margin="dense"
        />
      )}
    />
  )
}

export default Telegram
