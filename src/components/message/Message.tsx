import React, { FC, useCallback, useState } from 'react'
import { Card, Icon, Image } from 'semantic-ui-react'
import Moment from 'react-moment'
import { Message as MessageType } from '../../api/Message'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'
import { replaceMagic } from '../../lib/replaceLinksHelper'
import MessageModalDelete from './MessageModalDelete'
import MessageMap from './MessageMap'
import { Ticker } from '../../api/Ticker'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMastodon,
  faTelegram,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons'

interface Props {
  message: MessageType
  ticker: Ticker
}

const Message: FC<Props> = ({ message, ticker }) => {
  const [imageLightboxOpen, setImageLightboxOpen] = useState<boolean>(false)
  const [imageIndex, setImageIndex] = useState<number>(0)

  const openImageLightbox = useCallback(() => setImageLightboxOpen(true), [])
  const closeImageLightbox = useCallback(() => setImageLightboxOpen(false), [])

  const twitterIcon = useCallback(() => {
    if (message.twitter_url) {
      return (
        <a href={message.twitter_url} rel="noopener noreferrer" target="_blank">
          <Icon>
            <FontAwesomeIcon icon={faTwitter} />
          </Icon>
        </a>
      )
    }

    return null
  }, [message.twitter_url])

  const telegramIcon = useCallback(() => {
    if (message.telegram_url) {
      return (
        <a
          href={message.telegram_url}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon>
            <FontAwesomeIcon icon={faTelegram} />
          </Icon>
        </a>
      )
    }

    return null
  }, [message.telegram_url])

  const mastodonIcon = useCallback(() => {
    if (message.mastodon_url) {
      return (
        <a
          href={message.mastodon_url}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon>
            <FontAwesomeIcon icon={faMastodon} />
          </Icon>
        </a>
      )
    }

    return null
  }, [message.mastodon_url])

  const renderAttachments = () => {
    const attachments = message.attachments

    if (attachments === null || attachments.length === 0) {
      return null
    }

    const images = attachments.map((image, key) => (
      <Image
        key={key}
        onClick={() => {
          openImageLightbox()
          setImageIndex(key)
        }}
        rounded
        src={image.url}
        style={{ width: 200, height: 200, objectFit: 'cover' }}
      />
    ))
    const urls = attachments.map(image => image.url)

    return (
      <Card.Content align="center">
        {imageLightboxOpen && (
          <Lightbox
            mainSrc={urls[imageIndex]}
            nextSrc={urls[(imageIndex + 1) % urls.length]}
            onCloseRequest={closeImageLightbox}
            onMoveNextRequest={() =>
              setImageIndex((imageIndex + 1) % urls.length)
            }
            onMovePrevRequest={() =>
              setImageIndex((imageIndex + urls.length - 1) % urls.length)
            }
            prevSrc={urls[(imageIndex + urls.length - 1) % urls.length]}
          />
        )}
        <Image.Group size="medium">{images}</Image.Group>
      </Card.Content>
    )
  }

  return (
    <Card fluid>
      <Card.Content>
        <MessageModalDelete
          message={message}
          trigger={
            <Icon
              color="grey"
              fitted
              link
              name="close"
              style={{ float: 'right' }}
            />
          }
        />
        <p
          dangerouslySetInnerHTML={{
            __html: replaceMagic(message.text),
          }}
        />
      </Card.Content>
      {renderAttachments()}
      <MessageMap message={message} ticker={ticker} />
      <Card.Content extra>
        {twitterIcon()}
        {telegramIcon()}
        {mastodonIcon()}
        <Moment fromNow>{message.creation_date}</Moment>
      </Card.Content>
    </Card>
  )
}

export default Message
