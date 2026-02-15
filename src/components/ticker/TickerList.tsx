import { Table, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { GetTickersQueryParams } from '../../api/Ticker'
import useDebounce from '../../hooks/useDebounce'
import TickerListFilter from './TickerListFilter'
import TickerListItems from './TickerListItems'
import { useTranslation } from 'react-i18next'

interface Props {
  token: string
}

const TickerList: FC<Props> = ({ token }) => {
  const { t } = useTranslation()
  const [params, setParams] = useState<GetTickersQueryParams>({})
  const debouncedValue = useDebounce<GetTickersQueryParams>(params, 200, {})
  const [, setSearchParams] = useSearchParams()

  useEffect(() => {
    const newSearchParams = new URLSearchParams()

    if (params.order_by) newSearchParams.set('order_by', params.order_by)
    if (params.sort) newSearchParams.set('sort', params.sort)
    if (params.title) newSearchParams.set('title', params.title)
    if (params.origin) newSearchParams.set('domain', params.origin)
    if (params.active !== undefined) newSearchParams.set('active', String(params.active))
    setSearchParams(newSearchParams)
  }, [debouncedValue, params, setSearchParams])

  const setDirection = (order_by: string) => {
    if (params.order_by === order_by) {
      return params.sort === 'asc' ? 'asc' : 'desc'
    }

    return undefined
  }

  const sortActive = (order_by: string) => {
    return params.order_by === order_by
  }

  const handleSortChange = (order_by: string) => {
    const direction = params.sort === 'asc' ? 'desc' : 'asc'
    const sort = params.order_by === order_by ? direction : 'asc'
    setParams({ ...params, order_by, sort: sort })
  }

  const handleActiveChange = (_: React.MouseEvent<HTMLElement, MouseEvent>, value: unknown) => {
    if (typeof value !== 'string') return

    if (value === '') {
      setParams({ ...params, active: undefined })
    } else {
      setParams({ ...params, active: value === 'true' })
    }
  }

  const handleFilterChange = (field: string, value: string) => {
    setParams({ ...params, [field]: value })
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={5} sx={{ p: 1 }}>
              <TickerListFilter params={params} onTitleChange={handleFilterChange} onOriginChange={handleFilterChange} onActiveChange={handleActiveChange} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center" sortDirection={setDirection('id')}>
              <TableSortLabel active={sortActive('id')} direction={setDirection('id')} onClick={() => handleSortChange('id')}>
                {t('common.ID')}
              </TableSortLabel>
            </TableCell>
            <TableCell align="center" sortDirection={setDirection('active')}>
              <TableSortLabel active={sortActive('active')} direction={setDirection('active')} onClick={() => handleSortChange('active')}>
                {t('status.active')}
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={setDirection('title')}>
              <TableSortLabel active={sortActive('title')} direction={setDirection('title')} onClick={() => handleSortChange('title')}>
                {t('title.title')}
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={setDirection('origin')}>{t('common.webOrigins')}</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TickerListItems token={token} params={debouncedValue} />
      </Table>
    </TableContainer>
  )
}

export default TickerList
