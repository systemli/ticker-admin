import React, { FC, FormEvent, useCallback, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useQueryClient } from 'react-query'
import { Form, InputOnChangeData } from 'semantic-ui-react'
import { putRefreshInterval, Setting } from '../api/Settings'

interface Props {
  setting: Setting<string>
  callback: () => void
}

interface FormValues {
  refresh_interval: number
}

const RefreshIntervalForm: FC<Props> = props => {
  const setting = props.setting
  const { handleSubmit, register, setValue } = useForm<FormValues>({
    defaultValues: {
      refresh_interval: parseInt(setting.value, 10),
    },
  })
  const queryClient = useQueryClient()

  const onChange = useCallback(
    (e: FormEvent, { name, value }: InputOnChangeData) => {
      setValue(name, value)
    },
    [setValue]
  )

  const onSubmit: SubmitHandler<FormValues> = data => {
    putRefreshInterval(data.refresh_interval)
      .then(() => queryClient.invalidateQueries('refresh_interval_setting'))
      .finally(() => props.callback())
  }

  useEffect(() => {
    register('refresh_interval', { valueAsNumber: true })
  })

  return (
    <Form id="refreshIntervalForm" onSubmit={handleSubmit(onSubmit)}>
      <Form.Input
        defaultValue={setting.value}
        label="Interval"
        name="refresh_interval"
        onChange={onChange}
        type="number"
      />
    </Form>
  )
}

export default RefreshIntervalForm
