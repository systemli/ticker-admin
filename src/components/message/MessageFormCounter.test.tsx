import { render, screen } from '@testing-library/react'
import MessageFormCounter from './MessageFormCounter'

describe('MessageFormCounter', () => {
  it('should render the correct letter count', () => {
    const letterCount = 10
    const maxLength = 100
    render(<MessageFormCounter letterCount={letterCount} maxLength={maxLength} />)
    const letterCountElement = screen.getByText(`${letterCount}/${maxLength}`)
    expect(letterCountElement.parentElement).toHaveClass('MuiChip-colorSuccess')
  })

  it('should render a red chip when the letter count is over the limit', () => {
    const letterCount = 110
    const maxLength = 100
    render(<MessageFormCounter letterCount={letterCount} maxLength={maxLength} />)
    const letterCountElement = screen.getByText(`${letterCount}/${maxLength}`)
    expect(letterCountElement.parentElement).toHaveClass('MuiChip-colorError')
  })

  it('should render a green chip when the letter count is under the limit', () => {
    const letterCount = 90
    const maxLength = 100
    render(<MessageFormCounter letterCount={letterCount} maxLength={maxLength} />)
    const letterCountElement = screen.getByText(`${letterCount}/${maxLength}`)
    expect(letterCountElement.parentElement).toHaveClass('MuiChip-colorWarning')
  })
})
