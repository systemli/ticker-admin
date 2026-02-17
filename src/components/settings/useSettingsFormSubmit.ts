import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { ApiResponse, handleApiCall } from '../../api/Api'
import useAuth from '../../contexts/useAuth'
import useNotification from '../../contexts/useNotification'

interface UseSettingsFormSubmitProps<TFormData> {
  putApi: (token: string, data: TFormData) => Promise<ApiResponse<unknown>>
  queryKey: string
  successMessage: string
  errorMessage: string
  setSubmitting: (submitting: boolean) => void
  callback: () => void
  onSaved?: () => void
}

function useSettingsFormSubmit<TFormData>({
  putApi,
  queryKey,
  successMessage,
  errorMessage,
  setSubmitting,
  callback,
  onSaved,
}: UseSettingsFormSubmitProps<TFormData>) {
  const { t } = useTranslation()
  const { token } = useAuth()
  const { createNotification } = useNotification()
  const queryClient = useQueryClient()

  const onSubmit = (data: TFormData) => {
    setSubmitting(true)
    handleApiCall(putApi(token, data), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKey] })
        onSaved?.()
        createNotification({ content: t(successMessage), severity: 'success' })
        callback()
      },
      onError: () => {
        createNotification({ content: t(errorMessage), severity: 'error' })
      },
      onFailure: () => {
        createNotification({ content: t(errorMessage), severity: 'error' })
      },
    }).finally(() => {
      setSubmitting(false)
    })
  }

  return onSubmit
}

export default useSettingsFormSubmit
