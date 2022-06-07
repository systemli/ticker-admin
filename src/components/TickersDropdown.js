import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import withAuth from './withAuth'
import { getTickers } from '../api/Ticker'
import PropTypes from 'prop-types'

class TickersDropdown extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      tickers: [],
    }
  }

  componentDidMount() {
    getTickers().then(response => {
      let options = []
      response.data.tickers.map(ticker => {
        return options.push({
          key: ticker.id,
          text: ticker.title,
          value: ticker.id,
        })
      })

      this.setState({ tickers: options })
    })
  }

  render() {
    const options = this.state.tickers

    return (
      <Dropdown
        defaultValue={this.props.defaultValue}
        fluid
        multiple
        onChange={this.props.onChange}
        options={options}
        placeholder={this.props.placeholder}
        selection
      />
    )
  }
}

export default withAuth(TickersDropdown)

TickersDropdown.propTypes = {
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.array,
}
