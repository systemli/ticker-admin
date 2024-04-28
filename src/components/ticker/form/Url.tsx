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
      render={({ field }) => (
        <TextField
          {...field}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon icon={faComputerMouse} />
              </InputAdornment>
            ),
          }}
          label="Homepage"
          margin="dense"
        />
      )}
    />
  )
}

export default Url
