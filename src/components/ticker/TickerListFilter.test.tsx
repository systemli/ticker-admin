import { render, screen } from '@testing-library/react'
import TickerListFilter from './TickerListFilter'
import { GetTickersQueryParams } from '../../api/Ticker'
import userEvent from '@testing-library/user-event'

describe('TickerListFilter', async function () {
  it('should render', function () {
    const onTitleChange = vi.fn()
    const onDomainChange = vi.fn()
    const onActiveChange = vi.fn()
    const params = { title: '', domain: '', active: undefined } as GetTickersQueryParams

    render(<TickerListFilter params={params} onTitleChange={onTitleChange} onDomainChange={onDomainChange} onActiveChange={onActiveChange} />)

    expect(onTitleChange).not.toHaveBeenCalled()
    expect(onDomainChange).not.toHaveBeenCalled()
    expect(onActiveChange).not.toHaveBeenCalled()

    expect(screen.getByLabelText('Title')).toBeInTheDocument()
    expect(screen.getByLabelText('Domain')).toBeInTheDocument()
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Inactive')).toBeInTheDocument()

    expect(screen.getByLabelText('Title')).toHaveValue('')
    expect(screen.getByLabelText('Domain')).toHaveValue('')
    expect(screen.getByText('All')).toHaveClass('Mui-selected')
  })

  it('should call onTitleChange', async function () {
    const onTitleChange = vi.fn()
    const onDomainChange = vi.fn()
    const onActiveChange = vi.fn()
    const params = { title: '', domain: '', active: undefined } as GetTickersQueryParams

    render(<TickerListFilter params={params} onTitleChange={onTitleChange} onDomainChange={onDomainChange} onActiveChange={onActiveChange} />)

    await userEvent.type(screen.getByLabelText('Title'), 'foo')
    expect(onTitleChange).toHaveBeenCalledWith('title', 'f')
    expect(onTitleChange).toHaveBeenCalledWith('title', 'o')
    expect(onTitleChange).toHaveBeenCalledWith('title', 'o')
  })

  it('should call onDomainChange', async function () {
    const onTitleChange = vi.fn()
    const onDomainChange = vi.fn()
    const onActiveChange = vi.fn()
    const params = { title: '', domain: '', active: undefined } as GetTickersQueryParams

    render(<TickerListFilter params={params} onTitleChange={onTitleChange} onDomainChange={onDomainChange} onActiveChange={onActiveChange} />)

    await userEvent.type(screen.getByLabelText('Domain'), 'foo')
    expect(onDomainChange).toHaveBeenCalledWith('domain', 'f')
    expect(onDomainChange).toHaveBeenCalledWith('domain', 'o')
    expect(onDomainChange).toHaveBeenCalledWith('domain', 'o')
  })

  it('should call onActiveChange', async function () {
    const onTitleChange = vi.fn()
    const onDomainChange = vi.fn()
    const onActiveChange = vi.fn()
    const params = { title: '', domain: '', active: undefined } as GetTickersQueryParams

    render(<TickerListFilter params={params} onTitleChange={onTitleChange} onDomainChange={onDomainChange} onActiveChange={onActiveChange} />)

    await userEvent.click(screen.getByText('Active'))
    expect(onActiveChange).toHaveBeenCalledWith(expect.anything(), 'true')

    await userEvent.click(screen.getByText('Inactive'))
    expect(onActiveChange).toHaveBeenCalledWith(expect.anything(), 'false')

    await userEvent.click(screen.getByText('All'))
    expect(onActiveChange).toHaveBeenCalledWith(expect.anything(), '')
    expect(onActiveChange).toHaveBeenCalledTimes(3)
  })
})
