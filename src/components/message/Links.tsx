import Linkify from 'linkify-react'
import { FC } from 'react'

interface Props {
  message: string
}
const Links: FC<Props> = ({ message }) => {
  const format = (value: string, type: string) => {
    if (type === 'url') {
      value = value.replace(/https?:\/\//, '')
      return value.length > 30 ? `${value.slice(0, 30)}…` : value
    }
    return value
  }

  return <Linkify options={{ defaultProtocol: 'https', format: format }}>{message}</Linkify>
}

export default Links
