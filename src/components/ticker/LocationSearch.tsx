import React, { FC, useRef, useState } from 'react'
import { Autocomplete, TextField } from '@mui/material'

interface SearchResult {
  place_id: number
  lat: number
  lon: number
  display_name: string
}

export interface Result {
  title: string
  lat: number
  lon: number
}

async function api(value: string, signal: AbortSignal): Promise<SearchResult[]> {
  const url = 'https://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + value

  return fetch(url, { signal }).then(res => res.json())
}

interface Props {
  callback: (result: Result) => void
}

const LocationSearch: FC<Props> = ({ callback }) => {
  const [options, setOptions] = useState<SearchResult[]>([])
  const previousController = useRef<AbortController>()

  const handleInputChange = (event: React.SyntheticEvent, value: string) => {
    if (previousController.current) {
      previousController.current.abort()
    }

    const controller = new AbortController()
    const signal = controller.signal
    previousController.current = controller

    api(value, signal)
      .then(options => setOptions(options))
      .catch(() => {
        // We ignore the error
      })
  }

  const handleChange = (event: React.SyntheticEvent, value: SearchResult | null) => {
    if (value) {
      callback({ title: value?.display_name, lat: value?.lat, lon: value?.lon })
    }
  }

  return (
    <Autocomplete
      fullWidth
      getOptionLabel={option => option.display_name}
      onChange={handleChange}
      onInputChange={handleInputChange}
      options={options}
      renderInput={params => <TextField {...params} label="Location" variant="outlined" />}
    />
  )
}

export default LocationSearch
