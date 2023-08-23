import { type PrimitiveAtom, useAtomValue, useSetAtom } from 'jotai'
import { useState } from 'react'
import { useInterval } from 'usehooks-ts'
import X from '../svgs/x'
import Circle from '../svgs/circle'
import { deletedNotificationsAtom } from '../../utils/atoms'
import { type notification, notificationLevel, notificationType } from './model'
import { OpenAIKeyInput } from './Components'

function Notification(props: { notificationAtom: PrimitiveAtom<notification> }) {
  const notification = useAtomValue(props.notificationAtom)
  const setDeletedNotification = useSetAtom(deletedNotificationsAtom)
  const [countDown, setCountDown] = useState<number>(notification.autoClosable || 0)
  const [deleted, setDeleted] = useState<boolean>(false)

  if (countDown <= 0 && notification.closable && notification.autoClosable && !deleted) {
    setDeleted(true)
    setInterval(() => {
      setDeletedNotification(notifications => [...notifications, notification.id!])
    }, 1000)
  }

  useInterval(() => {
    if (notification.closable && notification.autoClosable)
      setCountDown(countDown => countDown - 1)
  }, countDown > 0 ? 1000 : null)

  let fillColor = '#000000'
  switch (notification.level) {
    case notificationLevel.info:
      fillColor = '#93c5fd'
      break
    case notificationLevel.warn:
      fillColor = '#fde047'
      break
    case notificationLevel.error:
      fillColor = '#fca5a5'
      break
  }

  const perimeter = 2 * 10 * Math.PI

  return (
    <>
      <div className='mb-5 w-full'>
        <div className={`level-${notification.level}-title flex justify-between rounded-t-lg py-1 pl-3 pr-1 text-base font-medium`}>
          {notification.title}
          {notification.closable
          && <div className='relative'>
              <Circle color={fillColor} all={perimeter} present={perimeter * (1 - countDown / (notification.autoClosable || 1))}/>
              <div className='absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] transition'
              onClick={() => setDeletedNotification(notifications => [...notifications, notification.id!])}>
                <X color={fillColor} width='1rem' height='1rem'/>
              </div>
          </div>}
        </div>
        <div className={`level-${notification.level}-msg whitespace-pre-line rounded-b-lg p-3 text-sm font-medium`}>
          {notification.message}
          {notification.type === notificationType.openaiKeyError
          && <OpenAIKeyInput id={notification.id!}/>}
        </div>
      </div>
    </>
  )
}

export default Notification
