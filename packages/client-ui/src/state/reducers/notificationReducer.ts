import { generateUniqueId } from '@lumy/client-core'

import { IBaseNotification, INotification } from '../context/notificationContext'

export type NotificationAction =
  | { type: 'addOne'; payload: IBaseNotification }
  | { type: 'hideOne'; payload: string }
  | { type: 'deleteOne'; payload: string }
  | { type: 'deleteAll' }

// only this number of the most recent notifications will be stored
const maxNumberNotificationsAllowed = 75

export const notificationReducer = (state: INotification[], action: NotificationAction): INotification[] => {
  switch (action.type) {
    case 'addOne': {
      const { id, message, type } = action?.payload ?? {}
      return [
        ...state,
        {
          id: id ? id : generateUniqueId(),
          message,
          type: type ? type : 'error',
          date: new Date().toString(),
          visible: true
        }
      ].slice(-maxNumberNotificationsAllowed)
    }

    case 'hideOne': {
      const id = action?.payload
      if (id == null) return state
      return state.map(notification =>
        notification.id === id ? { ...notification, visible: false } : notification
      )
    }

    case 'deleteOne': {
      const id = action?.payload
      if (id == null) return state
      return state.filter(notification => notification.id !== id)
    }

    case 'deleteAll':
      return []

    default:
      return state
  }
}
