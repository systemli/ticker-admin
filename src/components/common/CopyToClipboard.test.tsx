import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CopyToClipboard from './CopyToClipboard'

describe('CopyToClipboard', () => {
  const writeText = vi.fn()

  beforeAll(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText,
      },
    })
  })

  it('renders the component', async () => {
    render(<CopyToClipboard text="test" />)

    expect(screen.getByLabelText('Copy to Clipboard')).toBeInTheDocument()

    await userEvent.click(screen.getByLabelText('Copy to Clipboard'))

    expect(writeText).toHaveBeenCalledWith('test')
  })
})
