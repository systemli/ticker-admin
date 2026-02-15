import { faFilter } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { FC } from 'react'
import { GetTickersQueryParams } from '../../api/Ticker'
import { useTranslation } from 'react-i18next'

interface Props {
  params: GetTickersQueryParams
  onTitleChange: (field: string, value: string) => void
  onOriginChange: (field: string, value: string) => void
  onActiveChange: (e: React.MouseEvent<HTMLElement, MouseEvent>, value: unknown) => void
}

const TickerListFilter: FC<Props> = ({ params, onTitleChange, onOriginChange, onActiveChange }) => {
  const { t } = useTranslation()

  return (
    <Stack direction="row" alignItems="center">
      <Box sx={{ px: 1 }}>
        <FontAwesomeIcon icon={faFilter} />
      </Box>
      <Box sx={{ px: 1 }}>
        <TextField
          label={t('title.title')}
          onChange={e => onTitleChange('title', e.target.value)}
          placeholder={t('filter.byTitle')}
          size="small"
          value={params.title}
          variant="outlined"
        />
      </Box>
      <Box sx={{ px: 1 }}>
        <TextField
          label={t('filter.origin')}
          onChange={e => onOriginChange('origin', e.target.value)}
          placeholder={t('filter.byOrigin')}
          size="small"
          value={params.origin}
        />
      </Box>
      <Box sx={{ px: 1 }}>
        <ToggleButtonGroup size="small" value={params.active} exclusive onChange={onActiveChange}>
          <ToggleButton value="" selected={params.active === undefined}>
            {t('filter.all')}
          </ToggleButton>
          <ToggleButton value="true" selected={params.active === true}>
            {t('status.active')}
          </ToggleButton>
          <ToggleButton value="false" selected={params.active === false}>
            {t('status.inactive')}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Stack>
  )
}

export default TickerListFilter
