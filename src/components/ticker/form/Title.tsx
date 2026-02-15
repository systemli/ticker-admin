import { TextField } from '@mui/material'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const Title: FC = () => {
  const { t } = useTranslation()
  const { control } = useFormContext()

  return (
    <Controller
      name="title"
      control={control}
      rules={{
        required: t('message.titleRequired'),
        minLength: { value: 3, message: t('message.errorTitleShort') },
        maxLength: { value: 255, message: t('message.errorTitleLong') },
      }}
      render={({ field, fieldState: { error } }) => (
        <TextField {...field} error={!!error} helperText={error?.message ? error.message : null} label={t('title.title')} margin="dense" required />
      )}
    />
  )
}

export default Title
