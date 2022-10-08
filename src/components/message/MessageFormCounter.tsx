import React, { FC, useEffect, useState } from 'react'
import { Label, SemanticCOLORS } from 'semantic-ui-react'
import { MESSAGE_LIMIT } from './MessageForm'

interface Props {
  letterCount: number
}

const MessageFormCounter: FC<Props> = ({ letterCount }) => {
  const [color, setColor] = useState<SemanticCOLORS>('green')

  //TODO: Calculate length for Twitter (cutting links to 20 characters)
  useEffect(() => {
    if (letterCount > MESSAGE_LIMIT) {
      setColor('red')
    } else if (letterCount >= 260) {
      setColor('orange')
    } else if (letterCount >= 220) {
      setColor('yellow')
    } else {
      setColor('green')
    }
  }, [letterCount])

  return (
    <Label
      color={color}
      content={`${letterCount}/${MESSAGE_LIMIT}`}
      style={{ float: 'right' }}
    />
  )
}

export default MessageFormCounter
