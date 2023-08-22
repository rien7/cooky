import type { PrimitiveAtom } from 'jotai'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import renderSelection from '../utils/renderSelection'
import { translate } from '../utils/openai'

function ResultPresent(props: { sentenceAtom: PrimitiveAtom<string>; selectionAtom: PrimitiveAtom<{ s: number; e: number }[]>; resultAtom: PrimitiveAtom<string> }) {
  const sentence = useAtomValue(props.sentenceAtom)
  const selections = useAtomValue(props.selectionAtom)
  const [selectionsValue, setSelectionsValue] = useState<Map<string, string>>(new Map())
  const [result, setResult] = useAtom(props.resultAtom)

  useEffect(() => {
    setResult('')
    setSelectionsValue(new Map())
    let buffer = ''
    let sentenceTranslated = false
    async function getResult() {
      const stream = await translate(sentence, selections, 'English', 'Chinese')
      for await (const part of stream) {
        const data = part.choices[0]?.delta?.content || ''
        if (data === '❖')
          sentenceTranslated = true
        if (!sentenceTranslated) {
          setResult(result => result + data)
        }
        else {
          if (data === '\n' || data === '❖') {
            buffer = ''
            continue
          }
          buffer += data
          const match = buffer.match(/'(\d+)-(\d+)': (.*)\n?/)
          if (match) {
            const start = Number.parseInt(match[1])
            const end = Number.parseInt(match[2])
            if (selections.some(item => item.s === start && item.e === end)) {
              const text = match[3]
              setSelectionsValue(selectionsValue => new Map(selectionsValue.set(`${start}-${end}`, text)))
            }
          }
        }
      }
    }
    void getResult()
  }, [setResult, selections, sentence, setSelectionsValue])

  return (
    <>
      <div className={`absolute w-[80%] max-w-7xl ${result ? 'top-[30%]' : 'top-[50%]'} transition-[top]`}>
        <Sentence sentenceAtom={props.sentenceAtom} selectionAtom={props.selectionAtom} selectionsValue={selectionsValue}/>
      </div>
      { result && <div className={'absolute top-[40%] w-[80%] max-w-7xl'}>
          <Result result={result}/>
        </div>}
    </>
  )
}

function Sentence(props: { sentenceAtom: PrimitiveAtom<string>; selectionAtom: PrimitiveAtom<{ s: number; e: number }[]>; selectionsValue: Map<string, string> }) {
  const sentence = useAtomValue(props.sentenceAtom)
  const selections = useAtomValue(props.selectionAtom)
  return (
    <>
      <label className={'absolute z-10 block translate-y-[-50%] overflow-hidden border-transparent bg-transparent'}>
        <p className={'w-full cursor-text border-none bg-transparent p-0 font-serif text-xl font-medium transition duration-500'}>
          {renderSelection(selections, sentence, {
            default: 'text-primary dark:text-alabaster whitespace-pre-wrap',
            highlight: 'text-orange-400 whitespace-pre-wrap',
            value: 'text-orange-400 whitespace-pre-wrap text-sm',
          }, props.selectionsValue).map((item, index) => (
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
