import { Alert, Snackbar } from '@mui/material'
import { FC } from 'react'
import useNotification from '../contexts/useNotification'

interface Props {
  autoHideDuration?: number | null
}

const Notification: FC<Props> = ({ autoHideDuration = 6000 }) => {
  const { notification, isOpen, closeNotification } = useNotification()

  if (isOpen && notification?.content) {
    return (
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={autoHideDuration} onClose={closeNotification} open={isOpen}>
        <Alert onClose={closeNotification} severity={notification.severity || 'info'}>
          {notification.content}
        </Alert>
      </Snackbar>
    )
  }

  return null
}

export default Notification
