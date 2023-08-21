import { PrimitiveAtom, useAtom, useAtomValue } from "jotai"
import renderSelection from "../utils/renderSelection"
import { useEffect } from "react"

const ResultPresent = (props: { sentenceAtom: PrimitiveAtom<string>, selectionAtom: PrimitiveAtom<{s: number, e: number}[]>, resultAtom: PrimitiveAtom<string> }) => {
  const [result, updateResult] = useAtom(props.resultAtom)

  useEffect(() => {
    const data = ""

    const timeoutIds: number[] = []

    for (const c of data) {
      timeoutIds.push(setTimeout(() => {
        updateResult((result) => result + c)
      }, 5000 + 50 * timeoutIds.length))
    }

    return () => {timeoutIds.map((id) => clearTimeout(id))}

  }, [updateResult])

  return (
    <>
      <div className={`absolute w-[80%] max-w-7xl ${result ? 'top-[30%]' : 'top-[50%]'} transition-[top]`}>
        <Sentence sentenceAtom={props.sentenceAtom} selectionAtom={props.selectionAtom}/>
      </div>
      { result && <div className={`absolute w-[80%] max-w-7xl top-[40%]`}>
          <Result result={result}/>
        </div>}
    </>
  )
}

const Sentence = (props: { sentenceAtom: PrimitiveAtom<string>, selectionAtom: PrimitiveAtom<{s: number, e: number}[]> }) => {
  const sentence = useAtomValue(props.sentenceAtom)
  const selections = useAtomValue(props.selectionAtom)
  return (
    <>
      <label className={`absolute block overflow-hidden border-transparent bg-transparent z-10 -translate-y-[50%]`}>
        <p className={`w-full border-none bg-transparent p-0 text-xl font-medium font-serif cursor-text transition duration-500`}>
          {renderSelection(selections, sentence, { default: 'text-primary dark:text-alabaster whitespace-pre-wrap', 
                                                   highlight: 'text-orange-400 whitespace-pre-wrap' }).map((item, index) => (
            <span className={item.class} key={index}>{item.text}</span>
          ))}
        </p>
      </label>
    </>
  )
}

const Result = (props: { result: string }) => {
  return (
    <>
      <p className="font-medium font-serif text-primary dark:text-alabaster text-xl">{props.result}</p>
    </>
  )
}

export default ResultPresent