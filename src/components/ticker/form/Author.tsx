import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { InputAdornment, TextField } from '@mui/material'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

const Author: FC = () => {
  const { control } = useFormContext()

  return (
    <Controller
      name="information.author"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon icon={faUser} />
              </InputAdornment>
            ),
          }}
          label="Author"
          margin="dense"
        />
      )}
    />
  )
}

export default Author
