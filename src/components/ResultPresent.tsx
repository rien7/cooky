import type { PrimitiveAtom } from 'jotai'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect } from 'react'
import renderSelection from '../utils/renderSelection'

function ResultPresent(props: { sentenceAtom: PrimitiveAtom<string>; selectionAtom: PrimitiveAtom<{ s: number; e: number }[]>; resultAtom: PrimitiveAtom<string> }) {
  const [result, updateResult] = useAtom(props.resultAtom)

  useEffect(() => {
    const data = ''

    const timeoutIds: number[] = []

    for (const c of data) {
      timeoutIds.push(setTimeout(() => {
        updateResult(result => result + c)
      }, 5000 + 50 * timeoutIds.length))
    }

    return () => {
      timeoutIds.map(id => clearTimeout(id))
    }
  }, [updateResult])

  return (
    <>
      <div className={`absolute w-[80%] max-w-7xl ${result ? 'top-[30%]' : 'top-[50%]'} transition-[top]`}>
        <Sentence sentenceAtom={props.sentenceAtom} selectionAtom={props.selectionAtom}/>
      </div>
      { result && <div className={'absolute top-[40%] w-[80%] max-w-7xl'}>
          <Result result={result}/>
        </div>}
    </>
  )
}

function Sentence(props: { sentenceAtom: PrimitiveAtom<string>; selectionAtom: PrimitiveAtom<{ s: number; e: number }[]> }) {
  const sentence = useAtomValue(props.sentenceAtom)
  const selections = useAtomValue(props.selectionAtom)
  return (
    <>
      <label className={'absolute z-10 block translate-y-[-50%] overflow-hidden border-transparent bg-transparent'}>
        <p className={'w-full cursor-text border-none bg-transparent p-0 font-serif text-xl font-medium transition duration-500'}>
          {renderSelection(selections, sentence, {
            default: 'text-primary dark:text-alabaster whitespace-pre-wrap',
            highlight: 'text-orange-400 whitespace-pre-wrap',
          }).map((item, index) => (
            <span className={item.class} key={index}>{item.text}</span>
          ))}
        </p>
      </label>
    </>
  )
}

function Result(props: { result: string }) {
  return (
    <>
      <p className="font-serif text-xl font-medium text-primary dark:text-alabaster">{props.result}</p>
    </>
  )
}

export default ResultPresent
