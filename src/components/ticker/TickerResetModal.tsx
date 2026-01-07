import { useQueryClient } from '@tanstack/react-query'
import { FC, useCallback } from 'react'
import { handleApiCall } from '../../api/Api'
import { Ticker, putTickerResetApi } from '../../api/Ticker'
import useAuth from '../../contexts/useAuth'
import useNotification from '../../contexts/useNotification'
import Modal from '../common/Modal'
import { useTranslation } from 'react-i18next'

interface Props {
  onClose: () => void
  open: boolean
  ticker: Ticker
}

const TickerResetModal: FC<Props> = ({ onClose, open, ticker }) => {
  const { t } = useTranslation()
  const { createNotification } = useNotification()
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const handleReset = useCallback(() => {
    handleApiCall(putTickerResetApi(token, ticker), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['messages', ticker.id] })
        queryClient.invalidateQueries({ queryKey: ['tickerUsers', ticker.id] })
        queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
        createNotification({ content: t("tickers.reseted"), severity: 'success' })
        onClose()
      },
      onError: () => {
        createNotification({ content: t("tickers.errorReset"), severity: 'error' })
      },
      onFailure: error => {
        createNotification({ content: error as string, severity: 'error' })
      },
    })
  }, [token, ticker, queryClient, createNotification, onClose])

  return (
    <Modal dangerActionButtonText="Reset" onClose={onClose} onDangerAction={handleReset} open={open} title={t("tickers.reset")}>
      <p>
        <strong>{t("tickers.questionReset")}</strong>
      </p>
      <p>{t("tickers.resetMessage")}</p>
    </Modal>
  )
}

export default TickerResetModal
