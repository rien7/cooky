import { PrimitiveAtom, useAtom } from "jotai";
import { useEffect, useState } from "react";

export default function stepCheck(step: number, sentence?: string, selection?: {s: number, e: number}[]) {
  switch (step) {
    case 0:
      return sentence ? sentence.length !== 0 : false;
    case 1:
      return selection ? selection.length !== 0 : false;
    default:
      return false;
  }
}

export function useShowErrorDot(atom: PrimitiveAtom<boolean>, duration: number) {
  const [needToMount, setNeedToMount] = useAtom(atom)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (needToMount && !shouldRender) {
      setShouldRender(true)
      setTimeout(() => {
        setNeedToMount(false)
        setShouldRender(false)
      }, duration);
    }
  }, [duration, needToMount, setNeedToMount, shouldRender])

  return shouldRender
}