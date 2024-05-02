import { faFilter } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { FC } from 'react'
import { GetTickersQueryParams } from '../../api/Ticker'

interface Props {
  params: GetTickersQueryParams
  onTitleChange: (field: string, value: string) => void
  onDomainChange: (field: string, value: string) => void
  onActiveChange: (e: React.MouseEvent<HTMLElement, MouseEvent>, value: unknown) => void
}

const TickerListFilter: FC<Props> = ({ params, onTitleChange, onDomainChange, onActiveChange }) => {
  return (
    <Stack direction="row" alignItems="center">
      <Box sx={{ px: 1 }}>
        <FontAwesomeIcon icon={faFilter} />
      </Box>
      <Box sx={{ px: 1 }}>
        <TextField
          label="Title"
          onChange={e => onTitleChange('title', e.target.value)}
          placeholder="Filter by title"
          size="small"
          value={params.title}
          variant="outlined"
        />
      </Box>
      <Box sx={{ px: 1 }}>
        <TextField label="Domain" onChange={e => onDomainChange('domain', e.target.value)} placeholder="Filter by domain" size="small" value={params.domain} />
      </Box>
      <Box sx={{ px: 1 }}>
        <ToggleButtonGroup size="small" value={params.active} exclusive onChange={onActiveChange}>
          <ToggleButton value="" selected={params.active === undefined}>
            All
          </ToggleButton>
          <ToggleButton value="true" selected={params.active === true}>
            Active
          </ToggleButton>
          <ToggleButton value="false" selected={params.active === false}>
            Inactive
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Stack>
  )
}

export default TickerListFilter
