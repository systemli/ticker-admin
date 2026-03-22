import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Ticker } from '../../api/Ticker'
import { renderWithProviders, setMockToken, userToken } from '../../tests/utils'
import UploadButton from './UploadButton'

describe('UploadButton', () => {
  beforeEach(() => {
    setMockToken(userToken)
    fetchMock.resetMocks()
  })

  const onUpload = vi.fn()

  const ticker = { id: 1 } as Ticker

  it('should render with aria-label', () => {
    renderWithProviders(<UploadButton disabled={false} onUpload={onUpload} ticker={ticker} />)

    expect(screen.getByRole('button', { name: 'Upload' })).toBeInTheDocument()
    expect(screen.getByLabelText('Upload', { selector: 'input' })).toBeInTheDocument()
  })

  it('should render disabled', () => {
    renderWithProviders(<UploadButton disabled={true} onUpload={onUpload} ticker={ticker} />)

    expect(screen.getByRole('button', { name: 'Upload' })).toBeDisabled()
  })

  it('should upload files', async () => {
    renderWithProviders(<UploadButton disabled={false} onUpload={onUpload} ticker={ticker} />)

    fetchMock.mockResponseOnce(
      JSON.stringify({
        status: 'success',
        data: {
          uploads: [{ id: 1, uuid: 'abc', createdAt: new Date(), url: 'https://example.com/image.jpg', content_type: 'image/jpeg' }],
        },
      })
    )

    const file = new File(['image'], 'image.jpg', { type: 'image/jpeg' })
    const input = screen.getByLabelText('Upload', { selector: 'input' }) as HTMLInputElement

    await userEvent.upload(input, file)

    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('should not call onUpload on error response', async () => {
    renderWithProviders(<UploadButton disabled={false} onUpload={onUpload} ticker={ticker} />)

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'error' }))

    const file = new File(['image'], 'image.jpg', { type: 'image/jpeg' })
    const input = screen.getByLabelText('Upload', { selector: 'input' }) as HTMLInputElement

    await userEvent.upload(input, file)

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(onUpload).not.toHaveBeenCalled()
  })
})
