import { TableBody } from '@mui/material'
import { renderWithProviders, userToken } from '../../tests/utils'
import TickerList from './TickerList'
import TickerListItems from './TickerListItems'

vi.mock('./TickerListItems', () => {
  return {
    __esModule: true,
    default: vi.fn(() => <TableBody></TableBody>),
  }
})

describe('TickerList', function () {
  beforeEach(() => {
    fetchMock.resetMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const component = () => {
    return <TickerList token={userToken} />
  }

  it('should render', async function () {
    renderWithProviders(component())

    expect(TickerListItems).toHaveBeenCalledTimes(2)
  })
})
