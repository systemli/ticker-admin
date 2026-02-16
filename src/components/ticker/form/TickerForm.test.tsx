import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Ticker } from '../../../api/Ticker'
import { renderWithProviders, setMockToken, userToken } from '../../../tests/utils'
import TickerForm from './TickerForm'

describe('TickerForm', () => {
  beforeEach(() => {
    setMockToken(userToken)
    fetchMock.resetMocks()
    callback.mockClear()
    setSubmitting.mockClear()
  })

  const callback = vi.fn()
  const setSubmitting = vi.fn()
  const user = userEvent.setup()

  const component = ({ ticker }: { ticker?: Ticker }) => {
    return (
      <>
        <TickerForm ticker={ticker} id="tickerForm" callback={callback} setSubmitting={setSubmitting} />
        <input name="Submit" type="submit" value="Submit" form="tickerForm" />
      </>
    )
  }

  // Helper to fill a text field quickly using paste instead of typing
  // character by character, avoiding CI timeout issues.
  const fillField = async (name: string, value: string) => {
    const field = screen.getByRole('textbox', { name })
    await user.click(field)
    await user.paste(value)
  }

  it('should render the component', async () => {
    renderWithProviders(
      component({
        ticker: {
          id: 1,
          title: 'Ticker',
          active: false,
          information: {},
          location: {},
        } as Ticker,
      })
    )

    expect(screen.getByRole('textbox', { name: 'Title' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Active' })).toBeInTheDocument()
  })

  it('should submit for new ticker', async () => {
    renderWithProviders(component({ ticker: undefined }))

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await user.click(screen.getByRole('checkbox', { name: 'Active' }))
    await fillField('Title', 'New Ticker')
    await fillField('Description', 'Description')
    await fillField('Author', 'Author')
    await fillField('Homepage', 'https://example.org')
    await fillField('E-Mail', 'author@example.org')
    await fillField('Twitter', 'account')
    await fillField('Facebook', 'account')
    await fillField('Threads', '@account')
    await fillField('Instagram', 'account')
    await fillField('Telegram', 'account')
    await fillField('Mastodon', 'https://mastodon.social/@account')
    await fillField('Bluesky', 'https://bsky.app/profile/account.bsky.social')

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(callback).toHaveBeenCalledTimes(1)
    expect(setSubmitting).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('/api/admin/tickers', {
      body: JSON.stringify({
        title: 'New Ticker',
        active: true,
        description: 'Description',
        information: {
          author: 'Author',
          email: 'author@example.org',
          url: 'https://example.org',
          twitter: 'account',
          facebook: 'account',
          threads: '@account',
          instagram: 'account',
          telegram: 'account',
          mastodon: 'https://mastodon.social/@account',
          bluesky: 'https://bsky.app/profile/account.bsky.social',
        },
      }),
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
      method: 'post',
    })
  })

  it('should submit for existing ticker', async () => {
    renderWithProviders(
      component({
        ticker: {
          id: 1,
          title: 'Ticker',
          active: false,
          information: {},
          location: {},
        } as Ticker,
      })
    )

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await user.click(screen.getByRole('checkbox', { name: 'Active' }))
    await user.clear(screen.getByRole('textbox', { name: 'Title' }))
    await fillField('Title', 'New Ticker')
    await fillField('Description', 'Description')
    await fillField('Author', 'Author')
    await fillField('Homepage', 'https://example.org')
    await fillField('E-Mail', 'author@example.org')
    await fillField('Twitter', 'account')
    await fillField('Facebook', 'account')
    await fillField('Threads', '@account')
    await fillField('Instagram', 'account')
    await fillField('Telegram', 'account')
    await fillField('Mastodon', 'https://mastodon.social/@account')
    await fillField('Bluesky', 'https://bsky.app/profile/account.bsky.social')

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(callback).toHaveBeenCalledTimes(1)
    expect(setSubmitting).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('/api/admin/tickers/1', {
      body: JSON.stringify({
        title: 'New Ticker',
        active: true,
        description: 'Description',
        information: {
          author: 'Author',
          email: 'author@example.org',
          url: 'https://example.org',
          twitter: 'account',
          facebook: 'account',
          threads: '@account',
          instagram: 'account',
          telegram: 'account',
          mastodon: 'https://mastodon.social/@account',
          bluesky: 'https://bsky.app/profile/account.bsky.social',
        },
      }),
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
      method: 'put',
    })
  })

  it('should fail when response fails', async () => {
    renderWithProviders(
      component({
        ticker: {
          id: 1,
          title: 'Ticker',
          active: false,
          information: {},
          location: {},
        } as Ticker,
      })
    )

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'error' }))

    await user.click(screen.getByRole('checkbox', { name: 'Active' }))
    await fillField('Title', 'New Ticker')

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(callback).toHaveBeenCalledTimes(0)
    expect(setSubmitting).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should fail when request fails', async () => {
    renderWithProviders(
      component({
        ticker: {
          id: 1,
          title: 'Ticker',
          active: false,
          information: {},
          location: {},
        } as Ticker,
      })
    )

    fetchMock.mockReject()

    await user.click(screen.getByRole('checkbox', { name: 'Active' }))
    await fillField('Title', 'New Ticker')

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(callback).toHaveBeenCalledTimes(0)
    expect(setSubmitting).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
