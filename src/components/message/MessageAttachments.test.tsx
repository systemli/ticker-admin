import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Message } from '../../api/Message'
import MessageAttachements from './MessageAttachments'

describe('MessageAttachements', () => {
  const message = {
    id: 1,
    ticker: 1,
    text: 'Test message',
    createdAt: '2024-01-01T00:00:00Z',
    attachments: [
      { url: 'https://example.com/image1.jpg', contentType: 'image/jpeg' },
      { url: 'https://example.com/image2.jpg', contentType: 'image/jpeg' },
    ],
  } as Message

  it('should render nothing when there are no attachments', () => {
    const emptyMessage = { ...message, attachments: [] } as Message
    const { container } = render(<MessageAttachements message={emptyMessage} />)

    expect(container.firstChild).toBeNull()
  })

  it('should render images', () => {
    render(<MessageAttachements message={message} />)

    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(2)
    expect(images[0]).toHaveAttribute('src', 'https://example.com/image1.jpg')
    expect(images[1]).toHaveAttribute('src', 'https://example.com/image2.jpg')
  })

  it('should open lightbox on click', async () => {
    render(<MessageAttachements message={message} />)

    const buttons = screen.getAllByRole('button')
    await userEvent.click(buttons[0])

    expect(screen.getAllByRole('presentation').length).toBeGreaterThanOrEqual(1)
  })

  it('should open lightbox on Enter key', async () => {
    render(<MessageAttachements message={message} />)

    const buttons = screen.getAllByRole('button')
    buttons[0].focus()
    await userEvent.keyboard('{Enter}')

    expect(screen.getAllByRole('presentation').length).toBeGreaterThanOrEqual(1)
  })

  it('should open lightbox on Space key', async () => {
    render(<MessageAttachements message={message} />)

    const buttons = screen.getAllByRole('button')
    buttons[0].focus()
    await userEvent.keyboard(' ')

    expect(screen.getAllByRole('presentation').length).toBeGreaterThanOrEqual(1)
  })

  it('should not open lightbox on other keys', async () => {
    render(<MessageAttachements message={message} />)

    const buttons = screen.getAllByRole('button')
    buttons[0].focus()
    await userEvent.keyboard('{Tab}')

    expect(screen.queryByRole('presentation')).not.toBeInTheDocument()
  })
})
