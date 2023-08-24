export enum notificationLevel {
  'info',
  'warn',
  'error',
}

export enum notificationType {
  'openaiKeyError',
  'other',
}

export enum messageType {
  'notification',
}

export type messageValue = notification

export interface notification {
  id?: string
  level: notificationLevel
  type: notificationType
  title: string
  message: string
  autoClosable?: number
  closable: boolean
}

export interface message {
  type: messageType
  msg: messageValue
}

export function notificationData(
  level: notificationLevel,
  title: string,
  message: string,
  closable: boolean,
  autoClosable?: number,
  type?: notificationType,
  id?: string,
): message {
  return {
    type: messageType.notification,
    msg: {
      id: id || Math.random().toString(16),
      level,
      type: type || notificationType.other,
      title,
      message,
      autoClosable,
      closable,
    },
  }
}
