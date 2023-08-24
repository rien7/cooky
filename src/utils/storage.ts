import { notificationData, notificationLevel } from '../components/notification/model'

let db: IDBDatabase
const request = window.indexedDB.open('CookyDB', 1)
request.onerror = () => {
  console.warn(request.error?.message)
  window.postMessage(notificationData(
    notificationLevel.warn,
    'IndexedDB Open Error',
    'You may not be able to use the history function.\nCheck console for more information.',
    true,
    5,
  ))
}
request.onsuccess = () => {
  db = request.result
}
request.onupgradeneeded = () => {
  const db = request.result
  const store = db.createObjectStore('queryResult', { keyPath: 'id' })
  store.createIndex('timestamp', 'timestamp', { unique: false })
}

function addData(store: string, key: string | number, value: object) {
  const transaction = db.transaction(store, 'readwrite')
  const objectStore = transaction.objectStore(store)
  const request = objectStore.add({ id: key, ...value, timestamp: Date.now() })
  request.onerror = () => {
    console.warn(request.error?.message)
    window.postMessage(notificationData(
      notificationLevel.warn,
      'IndexedDB Add Error',
      'Cannot add data to IndexedDB.\nCheck console for more information.',
      true,
      5,
    ))
  }
}

function getData(store: string, key: string | number) {
  return new Promise((resolve, _reject) => {
    const transaction = db.transaction(store, 'readonly')
    const objectStore = transaction.objectStore(store)
    const request = objectStore.get(key)
    request.onerror = () => {
      console.warn(request.error?.message)
      window.postMessage(notificationData(
        notificationLevel.warn,
        'IndexedDB Get Error',
        'Cannot get data from IndexedDB.\nCheck console for more information.',
        true,
        5,
      ))
    }
    request.onsuccess = () => {
      resolve(request.result)
    }
  })
}

export { addData, getData }
