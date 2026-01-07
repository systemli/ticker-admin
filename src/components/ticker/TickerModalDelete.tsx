import { useQueryClient } from '@tanstack/react-query'
import { FC, useCallback } from 'react'
import { handleApiCall } from '../../api/Api'
import { Ticker, deleteTickerApi } from '../../api/Ticker'
import useAuth from '../../contexts/useAuth'
import useNotification from '../../contexts/useNotification'
import Modal from '../common/Modal'
import { useTranslation } from 'react-i18next'

interface Props {
  onClose: () => void
  open: boolean
  ticker: Ticker
}

const TickerModalDelete: FC<Props> = ({ open, onClose, ticker }) => {
  const { t } = useTranslation()
  const { createNotification } = useNotification()
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const handleDelete = useCallback(() => {
    handleApiCall(deleteTickerApi(token, ticker), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tickers'] })
        createNotification({ content: t("tickers.deleted"), severity: 'success' })
      },
      onError: () => {
        createNotification({ content: t('tickers.errorDelete'), severity: 'error' })
      },
      onFailure: error => {
        createNotification({ content: error as string, severity: 'error' })
      },
    })
  }, [token, ticker, queryClient, createNotification, t])

  return (
    <Modal dangerActionButtonText="Delete" onClose={onClose} onDangerAction={handleDelete} open={open} title={t("tickers.delete")}>
      {t('tickers.questionDelete')}
    </Modal>
  )
}

export default TickerModalDelete
