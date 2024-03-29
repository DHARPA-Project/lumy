import React, { createContext, useEffect } from 'react'

import { useLastError } from '@lumy/client-core'

import { useStoredReducer } from '../../hooks/useStoredReducer'
import { NotificationAction, notificationReducer } from '../reducers/notificationReducer'

export type NotificationCategory = 'success' | 'info' | 'warning' | 'error'

export interface IBaseNotification {
  id: string
  message: string
  type?: NotificationCategory
}

export interface INotification extends IBaseNotification {
  date: string
  visible: boolean
}

type CreateNotificationProps = {
  message: string
  id: string
  type?: NotificationCategory
}

type NotificationContextType = {
  notifications: INotification[]
  notificationDispatch: React.Dispatch<NotificationAction>
  createNotification: (args: CreateNotificationProps) => void
  hideNotification: (id: string) => void
  deleteNotification: (id: string) => void
  deleteAllNotifications: () => void
}

const initialNotifications: INotification[] = []

export const NotificationContext = createContext<NotificationContextType>(null)

export const NotificationProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [notifications, notificationDispatch] = useStoredReducer(
    notificationReducer,
    initialNotifications,
    '__lumy-notifications'
  )

  const [lastError] = useLastError()

  useEffect(() => {
    if (lastError == null) return

    const { id, message } = lastError ?? {}
    const sameNotification = notifications.find(notification => notification.id === id)
    if (sameNotification) return

    notificationDispatch({
      type: 'addOne',
      payload: { id, message: message?.length ? message : 'Unknown error' }
    })
  }, [lastError])

  const createNotification = ({ message, id, type }: CreateNotificationProps): void => {
    notificationDispatch({
      type: 'addOne',
      payload: { id, type, message }
    })
  }

  const hideNotification = (id: string): void => {
    notificationDispatch({
      type: 'hideOne',
      payload: id
    })
  }

  const deleteNotification = (id: string): void => notificationDispatch({ type: 'deleteOne', payload: id })

  const deleteAllNotifications = (): void => notificationDispatch({ type: 'deleteAll' })

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        notificationDispatch,
        createNotification,
        hideNotification,
        deleteNotification,
        deleteAllNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
