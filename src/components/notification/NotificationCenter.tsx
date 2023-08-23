import { atom, useAtom } from 'jotai'
import { useEffectOnce } from 'usehooks-ts'
import { useEffect } from 'react'
import { deletedNotificationsAtom, notificationsAtom } from '../../utils/atoms'
import type { message, notification } from './model'
import { messageType } from './model'
import Notification from './Notification'

function NotificationCenter() {
  const [notifications, setNotifications] = useAtom(notificationsAtom)
  const [deletedNotifications, setDeletedNotifications] = useAtom(deletedNotificationsAtom)

  function handleMessage(event: MessageEvent<message>) {
    if (event.data.type !== messageType.notification)
      return
    const notification = event.data.msg as notification
    if (!notification.id)
      notification.id = Math.random().toString(36)

    setNotifications(noti => new Map(noti.set(notification.id!, atom(notification))))
  }

  useEffectOnce(() => {
    window.addEventListener('message', (event: MessageEvent<message>) => handleMessage(event))
    return () => window.removeEventListener('message', (event: MessageEvent<message>) => handleMessage(event))
  })

  useEffect(() => {
    if (deletedNotifications.length === 0)
      return
    setNotifications((notifications) => {
      const newNotifications = new Map(notifications)
      for (const id of deletedNotifications)
        newNotifications.delete(id)
      return newNotifications
    })
    setDeletedNotifications([])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deletedNotifications])

  const content: JSX.Element[] = []

  for (const [key, notification] of notifications.entries())
    content.push(<Notification key={key} notificationAtom={notification}/>)

  return (
    <>
      <div className='absolute right-5 top-5 z-50 h-full w-96 max-w-[80%]'>
        {content}
      </div>
    </>
  )
}

export default NotificationCenter
