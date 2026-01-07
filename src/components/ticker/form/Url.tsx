import { faComputerMouse } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { InputAdornment, TextField } from '@mui/material'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const Url: FC = () => {
  const { t } = useTranslation()
  const { control } = useFormContext()

  return (
    <Controller
      name="information.url"
      control={control}
      rules={{
        required: false,
        pattern: {
          value: /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(:\d{1,5})?(\/.*)?$/i,
          message: t("integrations.errorHomepage"),
        },
      }}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={faComputerMouse} />
                </InputAdornment>
              ),
            },
          }}
          error={!!error}
          helperText={error?.message ? error.message : null}
          label={t("integrations.homepage")}
          margin="dense"
        />
      )}
    />
  )
}

export default Url
