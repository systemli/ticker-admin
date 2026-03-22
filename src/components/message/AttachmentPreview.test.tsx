import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Upload } from '../../api/Upload'
import AttachmentPreview from './AttachmentPreview'

describe('AttachmentPreview', () => {
  const onDelete = vi.fn()

  beforeEach(() => {
    onDelete.mockClear()
  })

  const upload = {
    id: 1,
    uuid: 'abc-123',
    createdAt: new Date(),
    url: 'https://example.com/image.jpg',
    content_type: 'image/jpeg',
  } as Upload

  it('should render with aria-label on delete button', () => {
    render(<AttachmentPreview onDelete={onDelete} upload={upload} />)

    expect(document.querySelector('img')).toHaveAttribute('src', 'https://example.com/image.jpg')
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
  })

  it('should call onDelete when delete button is clicked', async () => {
    render(<AttachmentPreview onDelete={onDelete} upload={upload} />)

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(onDelete).toHaveBeenCalledWith(upload)
  })
})
