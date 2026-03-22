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

    expect(screen.getAllByRole('presentation').length).toBeGreaterThanOrEqual(1)
    const img = document.querySelector('img')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'image1.jpg')

    await userEvent.click(screen.getByRole('button', { name: /close/i }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should render multiple images', async () => {
    render(<Lightbox images={['image1.jpg', 'image2.jpg']} open={open} onClose={onClose} />)

    expect(screen.getAllByRole('presentation').length).toBeGreaterThanOrEqual(1)
    const img = document.querySelector('img')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'image1.jpg')

    await userEvent.click(screen.getByRole('button', { name: /next/i }))

    expect(img).toHaveAttribute('src', 'image2.jpg')

    await userEvent.click(screen.getByRole('button', { name: /previous/i }))

    expect(img).toHaveAttribute('src', 'image1.jpg')

    await userEvent.keyboard('{ArrowRight}')

    expect(img).toHaveAttribute('src', 'image2.jpg')

    await userEvent.keyboard('{ArrowLeft}')

    expect(img).toHaveAttribute('src', 'image1.jpg')

    await userEvent.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
