import { FC, useEffect, useState } from 'react'
import { Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, SxProps, useTheme } from '@mui/material'
import { Ticker, useTickerApi } from '../../api/Ticker'
import useAuth from '../useAuth'

interface Props {
  name: string
  defaultValue: Array<Ticker>
  onChange: (tickers: Array<Ticker>) => void
  sx?: SxProps
}

const TickersDropdown: FC<Props> = ({ name, defaultValue, onChange, sx }) => {
  const [options, setOptions] = useState<Array<Ticker>>([])
  const [tickers, setTickers] = useState<Array<Ticker>>(defaultValue)
  const { token } = useAuth()
  const { getTickers } = useTickerApi(token)
  const theme = useTheme()

  const handleChange = (event: SelectChangeEvent<number[]>) => {
    const tickerIds = event.target.value as Array<number>
    const selectedTickers = options.filter(ticker => {
      return tickerIds.includes(ticker.id)
    })
    setTickers(selectedTickers)
    onChange(selectedTickers)
  }

  useEffect(() => {
    getTickers()
      .then(response => response.data.tickers)
      .then(tickers => {
        setOptions(tickers)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const renderValue = (selected: number[]) => {
    const selectedTickers = options.filter(ticker => {
      return selected.includes(ticker.id)
    })

    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {selectedTickers.map(selectedTicker => (
          <Chip
            key={selectedTicker.id}
            label={selectedTicker.title}
            onDelete={() => {
              const reduced = tickers.filter(ticker => {
                return selectedTicker.id !== ticker.id
              })
              setTickers(reduced)
              onChange(reduced)
            }}
            onMouseDown={e => {
              e.stopPropagation()
            }}
          />
        ))}
      </Box>
    )
  }

  const getStyle = (value: Ticker, tickers: Array<Ticker>) => {
    const tickerIds = tickers.map(ticker => ticker.id)
    return {
      fontWeight: tickerIds.indexOf(value.id) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
    }
  }

  const tickerIds = tickers.map(ticker => ticker.id)

  return (
    <FormControl sx={sx}>
      <InputLabel>Tickers</InputLabel>
      <Select
        input={<OutlinedInput label="Tickers" />}
        label="Tickers"
        multiple
        name={name}
        onChange={handleChange}
        renderValue={renderValue}
        value={tickerIds}
      >
        {options.map(ticker => (
          <MenuItem key={ticker.id} selected={tickers.includes(ticker)} style={getStyle(ticker, tickers)} value={ticker.id}>
            {ticker.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default TickersDropdown
