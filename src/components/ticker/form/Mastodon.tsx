import { faMastodon } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { InputAdornment, TextField } from '@mui/material'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

const Mastodon: FC = () => {
  const { control } = useFormContext()

  return (
    <Controller
      name="information.mastodon"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={faMastodon} />
                </InputAdornment>
              ),
            },
          }}
          label="Mastodon"
          margin="dense"
        />
      )}
    />
  )
}

export default Mastodon
