import React, { FC, useEffect, useState } from 'react'
import Moment from 'react-moment'

interface Props {
  format?: string
}

const Clock: FC<Props> = props => {
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    setInterval(() => setDate(new Date()), 1000)
  })

  return (
    <React.Fragment>
      <Moment format={props.format}>{date}</Moment>
    </React.Fragment>
  )
}

export default Clock
