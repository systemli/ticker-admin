import { screen } from '@testing-library/react'
import { Ticker } from '../../api/Ticker'
import { renderWithProviders } from '../../tests/utils'
import TickerDangerZoneCard from './TickerDangerZoneCard'

describe('TickerDangerZoneCard', () => {
  const ticker = { id: 1, title: 'Test Ticker' } as Ticker

  it('should render the danger zone card', () => {
    renderWithProviders(<TickerDangerZoneCard ticker={ticker} />)

    expect(screen.getByText('Danger Zone')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset Ticker' })).toBeInTheDocument()
  })
})
