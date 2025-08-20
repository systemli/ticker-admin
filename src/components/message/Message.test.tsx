import { screen } from '@testing-library/dom'
import { Message as MessageAPI } from '../../api/Message'
import { renderWithProviders } from '../../tests/utils'
import Message from './Message'

describe('Message', () => {
  it('should render', () => {
    const message = {
      id: 1,
      ticker: 1,
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

    renderWithProviders(<Message message={message} />)

    expect(screen.getByText('Multi line message with links')).toBeInTheDocument()
    expect(screen.getByText('example.com')).toBeInTheDocument()
    expect(screen.getByText('example.net')).toBeInTheDocument()
    expect(screen.getByRole('img')).toBeInTheDocument()
  })
})
