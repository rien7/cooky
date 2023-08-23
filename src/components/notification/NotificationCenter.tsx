import type { PrimitiveAtom } from 'jotai'
import { atom, useAtom } from 'jotai'
import { useEffectOnce } from 'usehooks-ts'
import type { message, notification } from './model'
import { messageType } from './model'
import Notification from './Notification'

const notificationsAtom = atom<PrimitiveAtom<notification>[]>([])

function NotificationCenter() {
  const [notifications, setNotifications] = useAtom(notificationsAtom)

  function handleMessage(event: MessageEvent<message>) {
    if (event.data.type !== messageType.notification)
      return
    const notification = event.data.msg as notification
    setNotifications(notifications => [...notifications, atom(notification)])
  }

  useEffectOnce(() => {
    window.addEventListener('message', (event: MessageEvent<message>) => handleMessage(event))
    return () => window.removeEventListener('message', (event: MessageEvent<message>) => handleMessage(event))
  })

  return (
    <>
      <div className='absolute right-5 top-5 z-50 h-full w-96 max-w-[80%]'>
        {notifications.map((notification, index) => (
          <Notification key={index} notificationAtom={notification} />
        ))}
      </div>
    </>
  )
}

export default NotificationCenter
