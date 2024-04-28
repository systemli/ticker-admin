import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { InputAdornment, TextField } from '@mui/material'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

const Twitter: FC = () => {
  const { control } = useFormContext()

  return (
    <Controller
      name="information.twitter"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" style={{ marginRight: '0px' }}>
                <FontAwesomeIcon icon={faTwitter} />
                <span style={{ paddingLeft: '8px' }}>twitter.com/</span>
              </InputAdornment>
            ),
          }}
          label="Twitter"
          margin="dense"
        />
      )}
    />
  )
}

export default Twitter
