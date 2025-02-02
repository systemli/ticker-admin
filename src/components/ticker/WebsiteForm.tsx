import { Delete } from '@mui/icons-material'
import { Button, FormControl, FormGroup, FormHelperText, IconButton, InputAdornment, OutlinedInput, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { putTickerWebsitesApi, Ticker, TickerWebsite } from '../../api/Ticker'
import useAuth from '../../contexts/useAuth'
import useNotification from '../../contexts/useNotification'

interface Props {
  callback: () => void
  ticker: Ticker
}

interface FormData {
  websites: Array<TickerWebsite>
}

const WebsiteForm: FC<Props> = ({ callback, ticker }) => {
  const websites = ticker.websites
  const { createNotification } = useNotification()
  const { token } = useAuth()
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { websites },
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'websites',
    rules: { validate: value => value.length > 0 },
  })
  const queryClient = useQueryClient()

  const onSubmit: SubmitHandler<FormData> = data => {
    putTickerWebsitesApi(token, ticker, data.websites).finally(() => {
      queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
      createNotification({ content: 'Websites were successfully updated', severity: 'success' })
      callback()
    })
  }

  return (
    <form id="configureWebsites" onSubmit={handleSubmit(onSubmit)}>
      <Grid columnSpacing={{ xs: 1, sm: 2, md: 3 }} container rowSpacing={1}>
        <Grid size={{ xs: 12 }}>
          <Typography>You can configure website origins for your ticker. The ticker will only be reachable from the configured websites.</Typography>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormGroup>
            {fields.map((field, index) => (
              <FormControl sx={{ mb: 1 }} error={!!errors.websites?.[index]?.origin} key={field.id}>
                <OutlinedInput
                  key={field.id}
                  {...register(`websites.${index}.origin`, {
                    pattern: {
                      message: 'Invalid URL',
                      value: /^(http|https):\/\/[^ "]+$/,
                    },
                  })}
                  placeholder="https://example.com"
                  required
                  sx={{ width: '100%' }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={() => remove(index)} edge="end" size="small">
                        <Delete />
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <FormHelperText>{errors.websites?.[index]?.origin?.message}</FormHelperText>
              </FormControl>
            ))}
          </FormGroup>
          <Button onClick={() => append({ origin: '' } as TickerWebsite)}>Add Origin</Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default WebsiteForm
