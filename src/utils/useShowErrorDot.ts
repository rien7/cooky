import type { PrimitiveAtom } from 'jotai'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'

export function useShowErrorDot(atom: PrimitiveAtom<boolean>, duration: number) {
  const [needToMount, setNeedToMount] = useAtom(atom)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (needToMount && !shouldRender) {
      setShouldRender(true)
      setTimeout(() => {
        setNeedToMount(false)
        setShouldRender(false)
      }, duration)
    }
  }, [duration, needToMount, setNeedToMount, shouldRender])

  return shouldRender
}
