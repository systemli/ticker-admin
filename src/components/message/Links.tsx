import Linkify from 'linkify-react'
import { FC } from 'react'

interface Props {
  message: string
}
const Links: FC<Props> = ({ message }) => {
  const render = ({ attributes, content }: { attributes: unknown; content: string }) => {
    const { href } = attributes as { href: string }
    content = content.replace(/^(https?:\/\/)/, '')

    if (content.endsWith('/')) {
      content = content.slice(0, -1)
    }

    if (content.length > 40) {
      content = content.slice(0, 40) + '...'
    }

    return (
      <a href={href} target="_blank" title={href}>
        {content}
      </a>
    )
  }

  return <Linkify options={{ defaultProtocol: 'https', render: render }}>{message}</Linkify>
}

export default Links
