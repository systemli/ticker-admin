import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Lightbox from './Lightbox'

describe('Lightbox', () => {
  beforeEach(() => {
    onClose.mockClear()
  })

  const open = true
  const onClose = vi.fn()

  it('should render', async () => {
    render(<Lightbox images={['image1.jpg']} open={open} onClose={onClose} />)

    expect(screen.getByRole('presentation')).toBeInTheDocument()
    expect(screen.getByRole('img')).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('src', 'image1.jpg')

    await userEvent.click(screen.getByRole('button', { name: /close/i }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should render multiple images', async () => {
    render(<Lightbox images={['image1.jpg', 'image2.jpg']} open={open} onClose={onClose} />)

    expect(screen.getByRole('presentation')).toBeInTheDocument()
    expect(screen.getByRole('img')).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('src', 'image1.jpg')

    await userEvent.click(screen.getByRole('button', { name: /next/i }))

    expect(screen.getByRole('img')).toHaveAttribute('src', 'image2.jpg')

    await userEvent.click(screen.getByRole('button', { name: /previous/i }))

    expect(screen.getByRole('img')).toHaveAttribute('src', 'image1.jpg')

    await userEvent.keyboard('{ArrowRight}')

    expect(screen.getByRole('img')).toHaveAttribute('src', 'image2.jpg')

    await userEvent.keyboard('{ArrowLeft}')

    expect(screen.getByRole('img')).toHaveAttribute('src', 'image1.jpg')

    await userEvent.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
