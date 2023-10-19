import React, { FC, useEffect, useState } from 'react'
import { Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, SxProps, useTheme } from '@mui/material'
import { Ticker, useTickerApi } from '../../api/Ticker'
import useAuth from '../useAuth'

interface Props {
  name: string
  defaultValue: Array<number>
  onChange: (tickers: number[]) => void
  sx?: SxProps
}

const TickersDropdown: FC<Props> = ({ name, defaultValue, onChange, sx }) => {
  const [options, setOptions] = useState<Array<Ticker>>([])
  const [tickers, setTickers] = useState<Array<number>>(defaultValue)
  const { token } = useAuth()
  const { getTickers } = useTickerApi(token)
  const theme = useTheme()

  const handleChange = (event: SelectChangeEvent<typeof tickers>) => {
    if (typeof event.target.value !== 'string') {
      setTickers(event.target.value)
      onChange(event.target.value)
    }
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
        {selectedTickers.map(ticker => (
          <Chip
            key={ticker.id}
            label={ticker.title}
            onDelete={() => {
              const reduced = tickers.filter(id => {
                return id !== ticker.id
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

  const getStyle = (value: number, tickers: number[]) => {
    return {
      fontWeight: tickers.indexOf(value) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
    }
  }

  return (
    <FormControl sx={sx}>
      <InputLabel>Tickers</InputLabel>
      <Select input={<OutlinedInput label="Tickers" />} label="Tickers" multiple name={name} onChange={handleChange} renderValue={renderValue} value={tickers}>
        {options.map(ticker => (
          <MenuItem key={ticker.id} selected={tickers.includes(ticker.id)} style={getStyle(ticker.id, tickers)} value={ticker.id}>
            {ticker.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default TickersDropdown
