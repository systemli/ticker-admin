import { TextField } from '@mui/material'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const Description: FC = () => {
  const { t } = useTranslation()
  const { control } = useFormContext()

  return (
    <Controller
      name="description"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          error={!!error}
          helperText={error?.message ? error.message : null}
          margin="dense"
          maxRows={10}
          minRows={3}
          multiline
          label={t("common.description")}
        />
      )}
    />
  )
}

export default Description
