import { Checkbox, FormControlLabel } from '@mui/material'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface Props {
  defaultChecked?: boolean
}

const Active: FC<Props> = ({ defaultChecked }) => {
  const { t } = useTranslation()
  const { control } = useFormContext()

  return (
    <Controller
      name="active"
      control={control}
      render={({ field }) => <FormControlLabel control={<Checkbox {...field} defaultChecked={defaultChecked} />} label={t("status.active")} />}
    />
  )
}

export default Active
