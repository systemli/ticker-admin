import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../tests/utils'
import EmojiPicker from './EmojiPicker'

describe('EmojiPicker', () => {
  const onChange = vi.fn()

  it('should render with aria-label', () => {
    renderWithProviders(<EmojiPicker disabled={false} onChange={onChange} />)

    expect(screen.getByRole('button', { name: 'Emoji' })).toBeInTheDocument()
  })

  it('should render disabled', () => {
    renderWithProviders(<EmojiPicker disabled={true} onChange={onChange} />)

    expect(screen.getByRole('button', { name: 'Emoji' })).toHaveAttribute('aria-disabled', 'true')
  })
})
