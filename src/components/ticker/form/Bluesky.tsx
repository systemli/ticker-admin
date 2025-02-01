import { faBluesky } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { InputAdornment, TextField } from '@mui/material'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

const Bluesky: FC = () => {
  const { control } = useFormContext()

  return (
    <Controller
      name="information.bluesky"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={faBluesky} />
                </InputAdornment>
              ),
            },
          }}
          label="Bluesky"
          margin="dense"
        />
      )}
    />
  )
}

export default Bluesky
