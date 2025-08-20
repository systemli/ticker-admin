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

  const component = ({ ticker }: { ticker?: Ticker }) => {
    return (
      <>
        <TickerForm ticker={ticker} id="tickerForm" callback={callback} setSubmitting={setSubmitting} />
        <input name="Submit" type="submit" value="Submit" form="tickerForm" />
      </>
    )
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

    await userEvent.click(screen.getByRole('checkbox', { name: 'Active' }))
    await userEvent.type(screen.getByRole('textbox', { name: 'Title' }), 'New Ticker')
    await userEvent.type(screen.getByRole('textbox', { name: 'Description' }), 'Description')
    await userEvent.type(screen.getByRole('textbox', { name: 'Author' }), 'Author')
    await userEvent.type(screen.getByRole('textbox', { name: 'Homepage' }), 'https://example.org')
    await userEvent.type(screen.getByRole('textbox', { name: 'E-Mail' }), 'author@example.org')
    await userEvent.type(screen.getByRole('textbox', { name: 'Twitter' }), 'account')
    await userEvent.type(screen.getByRole('textbox', { name: 'Facebook' }), 'account')
    await userEvent.type(screen.getByRole('textbox', { name: 'Threads' }), '@account')
    await userEvent.type(screen.getByRole('textbox', { name: 'Instagram' }), 'account')
    await userEvent.type(screen.getByRole('textbox', { name: 'Telegram' }), 'account')
    await userEvent.type(screen.getByRole('textbox', { name: 'Mastodon' }), 'https://mastodon.social/@account')
    await userEvent.type(screen.getByRole('textbox', { name: 'Bluesky' }), 'https://bsky.app/profile/account.bsky.social')

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(callback).toHaveBeenCalledTimes(1)
    expect(setSubmitting).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/v1/admin/tickers', {
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

    await userEvent.click(screen.getByRole('checkbox', { name: 'Active' }))
    await userEvent.clear(screen.getByRole('textbox', { name: 'Title' }))
    await userEvent.type(screen.getByRole('textbox', { name: 'Title' }), 'New Ticker')
    await userEvent.type(screen.getByRole('textbox', { name: 'Description' }), 'Description')
    await userEvent.type(screen.getByRole('textbox', { name: 'Author' }), 'Author')
    await userEvent.type(screen.getByRole('textbox', { name: 'Homepage' }), 'https://example.org')
    await userEvent.type(screen.getByRole('textbox', { name: 'E-Mail' }), 'author@example.org')
    await userEvent.type(screen.getByRole('textbox', { name: 'Twitter' }), 'account')
    await userEvent.type(screen.getByRole('textbox', { name: 'Facebook' }), 'account')
    await userEvent.type(screen.getByRole('textbox', { name: 'Threads' }), '@account')
    await userEvent.type(screen.getByRole('textbox', { name: 'Instagram' }), 'account')
    await userEvent.type(screen.getByRole('textbox', { name: 'Telegram' }), 'account')
    await userEvent.type(screen.getByRole('textbox', { name: 'Mastodon' }), 'https://mastodon.social/@account')
    await userEvent.type(screen.getByRole('textbox', { name: 'Bluesky' }), 'https://bsky.app/profile/account.bsky.social')

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(callback).toHaveBeenCalledTimes(1)
    expect(setSubmitting).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/v1/admin/tickers/1', {
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

    await userEvent.click(screen.getByRole('checkbox', { name: 'Active' }))
    await userEvent.type(screen.getByRole('textbox', { name: 'Title' }), 'New Ticker')

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

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

    await userEvent.click(screen.getByRole('checkbox', { name: 'Active' }))
    await userEvent.type(screen.getByRole('textbox', { name: 'Title' }), 'New Ticker')

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(callback).toHaveBeenCalledTimes(0)
    expect(setSubmitting).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
