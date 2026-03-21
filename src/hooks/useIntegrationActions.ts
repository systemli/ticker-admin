import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { ApiResponse, handleApiCall } from '../api/Api'
import { Ticker } from '../api/Ticker'
import useAuth from '../contexts/useAuth'
import useNotification from '../contexts/useNotification'

type DeleteApiFn = (token: string, ticker: Ticker) => Promise<ApiResponse<unknown>>
type ToggleApiFn = (token: string, data: { active: boolean }, ticker: Ticker) => Promise<ApiResponse<unknown>>

interface UseIntegrationActionsConfig {
  ticker: Ticker
  i18nPrefix: string
  deleteApi: DeleteApiFn
  toggleApi?: ToggleApiFn
  active?: boolean
}

const useIntegrationActions = ({ ticker, i18nPrefix, deleteApi, toggleApi, active }: UseIntegrationActionsConfig) => {
  const { t } = useTranslation()
  const { createNotification } = useNotification()
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const handleDelete = () => {
    handleApiCall(deleteApi(token, ticker), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
        createNotification({ content: t(`${i18nPrefix}.deleted`), severity: 'success' })
      },
      onError: () => {
        createNotification({ content: t(`${i18nPrefix}.errorDelete`), severity: 'error' })
      },
      onFailure: error => {
        createNotification({ content: error as string, severity: 'error' })
      },
    })
  }

  const handleToggle =
    toggleApi && active !== undefined
      ? () => {
          handleApiCall(toggleApi(token, { active: !active }, ticker), {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
              createNotification({ content: t(active ? `${i18nPrefix}.disabled` : `${i18nPrefix}.enabled`), severity: 'success' })
            },
            onError: () => {
              createNotification({ content: t(`${i18nPrefix}.errorUpdate`), severity: 'error' })
            },
            onFailure: error => {
              createNotification({ content: error as string, severity: 'error' })
            },
          })
        }
      : undefined

  return { handleDelete, handleToggle, t }
}

export default useIntegrationActions
