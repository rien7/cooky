interface PromiseType {
  resolve: (value: string) => void
  reject: (reason?: any) => void
}

const promiseMap = new Map<string, PromiseType>()

export function setPromiseMap(key: string, promise: PromiseType) {
  promiseMap.set(key, promise)
}

export function getPromiseMap(key: string) {
  const promise = promiseMap.get(key)
  promiseMap.delete(key)
  return promise
}
