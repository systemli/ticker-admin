import React from 'react'
import _ from 'lodash'
import { Search } from 'semantic-ui-react'
import PropTypes from 'prop-types'

const initialState = { isLoading: false, results: [], value: '' }

export default class LocationSearch extends React.Component {
  constructor(props) {
    super(props)

    this.state = initialState
  }

  handleResultSelect(e, { result }) {
    this.setState({ value: result.title })

    if (typeof this.props.callback === 'function') {
      this.props.callback(result)
    }
  }

  handleSearchChange(e, { value }) {
    this.setState({ isLoading: true, value })

    setTimeout(() => {
      if (this.state.value.length < 1) return this.setState(initialState)

      let language = navigator.language || navigator.userLanguage
      fetch(
        'https://nominatim.openstreetmap.org/search?format=json&limit=5&q=' +
          value +
          '&accept-language=' +
          language
      )
        .then(response => response.json())
        .then(response => {
          let results = []
          _.each(response, function (value) {
            results.push({
              title: value.display_name,
              lat: value.lat,
              lon: value.lon,
            })
          })

          this.setState({ isLoading: false, results: results })
        })
    }, 300)
  }

  render() {
    const { isLoading, results, value } = this.state
    const props = Object.assign({}, this.props, { callback: undefined })

    return (
      <React.Fragment>
        <Search
          loading={isLoading}
          onResultSelect={this.handleResultSelect.bind(this)}
          onSearchChange={_.debounce(this.handleSearchChange.bind(this), 500, {
            leading: true,
          })}
          results={results}
          value={value}
          {...props}
        />
      </React.Fragment>
    )
  }
}

LocationSearch.propTypes = {
  callback: PropTypes.func.isRequired,
}
