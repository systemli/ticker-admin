import React, {
  FC,
  SyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { Dropdown, DropdownItemProps, DropdownProps } from 'semantic-ui-react'
import withAuth from './withAuth'
import { getTickers } from '../api/Ticker'

interface Props {
  name: string
  defaultValue: Array<number>
  onChange: (event: SyntheticEvent, input: DropdownProps) => void
}

const TickersDropdown: FC<Props> = props => {
  const [options, setOptions] = useState<DropdownItemProps[]>([])

  const onChange = useCallback(
    (event: SyntheticEvent, input: DropdownProps) => {
      props.onChange(event, input)
    },
    [props]
  )

  useEffect(() => {
    getTickers()
      .then(response => response.data.tickers)
      .then(tickers => {
        const availableOptions: DropdownItemProps[] = []
        tickers.map(ticker => {
          availableOptions.push({
            key: ticker.id,
            text: ticker.title,
            value: ticker.id,
          })
        })
        setOptions(availableOptions)
      })
  }, [])

  return (
    <Dropdown
      defaultValue={props.defaultValue}
      fluid
      multiple
      name={props.name}
      onChange={onChange}
      options={options}
      placeholder="Select a Ticker"
      selection
    />
  )
}

export default withAuth(TickersDropdown)