import React from 'react'
import Moment from 'react-moment'
import PropTypes from 'prop-types'

export default class Clock extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: new Date(),
      format: props.format || null,
    }
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000)
  }

  componentWillUnmount() {
    clearInterval(this.timerID)
  }

  tick() {
    this.setState({
      date: new Date(),
    })
  }

  render() {
    return (
      <React.Fragment>
        <Moment format={this.state.format}>{this.state.date}</Moment>
      </React.Fragment>
    )
  }
}

Clock.propTypes = {
  format: PropTypes.string,
}
