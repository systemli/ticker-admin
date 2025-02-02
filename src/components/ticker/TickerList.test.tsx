import { queryClient, setup, userToken } from '../../tests/utils'
import TickerList from './TickerList'
import TickerListItems from './TickerListItems'

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
    vi.mock('./TickerListItems', () => {
      return {
        __esModule: true,
        default: vi.fn(() => <div></div>),
      }
    })

    setup(queryClient, component())

    expect(TickerListItems).toHaveBeenCalledTimes(3)
  })
})
