import { Checkbox, FormControlLabel } from '@mui/material'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

interface Props {
  defaultChecked?: boolean
}

const Active: FC<Props> = ({ defaultChecked }) => {
  const { control } = useFormContext()

  return (
    <Controller
      name="active"
      control={control}
      render={({ field }) => <FormControlLabel control={<Checkbox {...field} defaultChecked={defaultChecked} />} label="Active" />}
    />
  )
}

export default Active
