import { ReactNode, createContext, useMemo, useState } from 'react'

type Severity = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  content: ReactNode
  severity?: Severity
}

interface NotificationContextType {
  notification?: Notification
  isOpen?: boolean
  createNotification: (notification: Notification) => void
  closeNotification: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: Readonly<{ children: ReactNode }>): JSX.Element {
  const [notification, setNotification] = useState<Notification | undefined>(undefined)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const createNotification = (notification: Notification): void => {
    setNotification(notification)
    setIsOpen(true)
  }

  const closeNotification = (): void => {
    setIsOpen(false)
  }

  const contextValue = useMemo(
    () => ({
      notification,
      isOpen,
      createNotification,
      closeNotification,
    }),
    [notification, isOpen]
  )

  return <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>
}

export default NotificationContext
