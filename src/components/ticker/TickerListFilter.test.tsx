import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GetTickersQueryParams } from '../../api/Ticker'
import TickerListFilter from './TickerListFilter'

describe('TickerListFilter', async function () {
  it('should render', function () {
    const onTitleChange = vi.fn()
    const onOriginChange = vi.fn()
    const onActiveChange = vi.fn()
    const params = { title: '', origin: '', active: undefined } as GetTickersQueryParams

    render(<TickerListFilter params={params} onTitleChange={onTitleChange} onOriginChange={onOriginChange} onActiveChange={onActiveChange} />)

    expect(onTitleChange).not.toHaveBeenCalled()
    expect(onOriginChange).not.toHaveBeenCalled()
    expect(onActiveChange).not.toHaveBeenCalled()

    expect(screen.getByLabelText('Title')).toBeInTheDocument()
    expect(screen.getByLabelText('Origin')).toBeInTheDocument()
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Inactive')).toBeInTheDocument()

    expect(screen.getByLabelText('Title')).toHaveValue('')
    expect(screen.getByLabelText('Origin')).toHaveValue('')
    expect(screen.getByText('All')).toHaveClass('Mui-selected')
  })

  it('should call onTitleChange', async function () {
    const onTitleChange = vi.fn()
    const onOriginChange = vi.fn()
    const onActiveChange = vi.fn()
    const params = { title: '', origin: '', active: undefined } as GetTickersQueryParams

    render(<TickerListFilter params={params} onTitleChange={onTitleChange} onOriginChange={onOriginChange} onActiveChange={onActiveChange} />)

    await userEvent.type(screen.getByLabelText('Title'), 'foo')
    expect(onTitleChange).toHaveBeenCalledWith('title', 'f')
    expect(onTitleChange).toHaveBeenCalledWith('title', 'o')
    expect(onTitleChange).toHaveBeenCalledWith('title', 'o')
  })

  it('should call onOriginChange', async function () {
    const onTitleChange = vi.fn()
    const onOriginChange = vi.fn()
    const onActiveChange = vi.fn()
    const params = { title: '', origin: '', active: undefined } as GetTickersQueryParams

    render(<TickerListFilter params={params} onTitleChange={onTitleChange} onOriginChange={onOriginChange} onActiveChange={onActiveChange} />)

    await userEvent.type(screen.getByLabelText('Origin'), 'foo')
    expect(onOriginChange).toHaveBeenCalledWith('origin', 'f')
    expect(onOriginChange).toHaveBeenCalledWith('origin', 'o')
    expect(onOriginChange).toHaveBeenCalledWith('origin', 'o')
  })

  it('should call onActiveChange', async function () {
    const onTitleChange = vi.fn()
    const onOriginChange = vi.fn()
    const onActiveChange = vi.fn()
    const params = { title: '', origin: '', active: undefined } as GetTickersQueryParams

    render(<TickerListFilter params={params} onTitleChange={onTitleChange} onOriginChange={onOriginChange} onActiveChange={onActiveChange} />)

    await userEvent.click(screen.getByText('Active'))
    expect(onActiveChange).toHaveBeenCalledWith(expect.anything(), 'true')

    await userEvent.click(screen.getByText('Inactive'))
    expect(onActiveChange).toHaveBeenCalledWith(expect.anything(), 'false')

    await userEvent.click(screen.getByText('All'))
    expect(onActiveChange).toHaveBeenCalledWith(expect.anything(), '')
    expect(onActiveChange).toHaveBeenCalledTimes(3)
  })
})
