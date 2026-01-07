import { faTelegram } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { InputAdornment, TextField } from '@mui/material'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const Telegram: FC = () => {
  const { t } = useTranslation()
  const { control } = useFormContext()

  return (
    <Controller
      name="information.telegram"
      control={control}
      rules={{
        required: false,
        pattern: {
          value: /^\w{5,32}$/,
          message: t("social.errorTelegramUser")
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
          label={t("integrations.telegram.title")}
          margin="dense"
        />
      )}
    />
  )
}

export default Telegram
