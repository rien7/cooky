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
  title?: string
  message: string
  autoClosable?: number
  closable: boolean
}

export interface message {
  type: messageType
  msg: messageValue
}
