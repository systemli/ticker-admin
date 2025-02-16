import { screen } from '@testing-library/dom'
import { Message as MessageAPI } from '../../api/Message'
import { Ticker } from '../../api/Ticker'
import { queryClient, setup } from '../../tests/utils'
import Message from './Message'

describe('Message', () => {
  it('should render', () => {
    const ticker = {
      location: {
        lat: 0,
        lon: 0,
      },
    } as Ticker
    const message = {
      createdAt: '2021-10-01T00:00:00Z',
      text: 'Multi line message with links\nhttps://example.com\nhttps://example.net',
      attachments: [
        {
          contentType: 'image/jpeg',
          url: 'https://example.com/image.jpg',
        },
      ],
      mastodonUrl: 'https://mastodonurl.com',
      blueskyUrl: 'https://blueskyurl.com',
      geoInformation: '{}',
    } as MessageAPI

    setup(queryClient, <Message message={message} ticker={ticker} />)

    expect(screen.getByText('Multi line message with links')).toBeInTheDocument()
    expect(screen.getByTitle('https://example.com')).toBeInTheDocument()
    expect(screen.getByTitle('https://example.net')).toBeInTheDocument()
    expect(screen.getByRole('img')).toBeInTheDocument()
  })
})
