import { useAtom, useAtomValue } from 'jotai'
import { useRef, useState } from 'react'
import { useEffectOnce } from 'usehooks-ts'
import OpenAI from 'openai'
import { Md5 } from 'ts-md5'
import renderSelection from '../utils/renderSelection'
import { postError, translate } from '../utils/openai'
import { resultAtom, selectionAtom, sentenceAtom } from '../utils/atoms'
import { addData, getData } from '../utils/storage'
import { notificationData, notificationLevel } from './notification/model'

function ResultPresent() {
  const sentence = useAtomValue(sentenceAtom)
  const selections = useAtomValue(selectionAtom)
  const [selectionsValue, setSelectionsValue] = useState<Map<string, string>>(new Map())
  const [result, setResult] = useAtom(resultAtom)
  const model = useRef('')
  const streamClosed = useRef(false)

  const id = Md5.hashStr(`${sentence}\n${selections.map(item => `${item.s}-${item.e}`).join(',')}`)

  useEffectOnce(() => {
    setResult('')
    setSelectionsValue(new Map())
    let buffer = ''
    let sentenceTranslated = false
    async function getResult() {
      const cache = await getData('queryResult', id) as { id: string; result: string; model: string; selections: { s: number; e: number; t: string; v: string }[]; sentence: string } | undefined
      if (cache) {
        setResult(cache.result)
        setSelectionsValue(new Map(cache.selections.map(item => [`${item.s}-${item.e}`, item.v])))
        return
      }
      let stream
      try {
        stream = await translate(sentence, selections, 'English', 'Chinese')
      }
      catch (e) {
        if (e instanceof OpenAI.APIError) {
          if (e.code === 'invalid_api_key') {
            await postError('OpenAI API key error', 'Incorrect API key provided.\nPlease check your OpenAI API key and try again.')
            stream = await translate(sentence, selections, 'English', 'Chinese')
          }
          else {
            window.postMessage(notificationData(
              notificationLevel.error,
              'OpenAI API error',
              e.message,
              true,
              10,
            ))
          }
        }
        else {
          throw e
        }
      }
      for await (const part of stream!) {
        const data = part.choices[0]?.delta?.content || ''
        model.current = part.model
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
      if (!streamClosed.current)
        streamClosed.current = true
    }
    void getResult()
  })

  if (streamClosed.current) {
    const data = {
      sentence,
      selections: selections.map(item => ({
        s: item.s,
        e: item.e,
        t: sentence.slice(item.s, item.e),
        v: selectionsValue.get(`${item.s}-${item.e}`) || '',
      })),
      result,
      model: model.current,
    }

    addData('queryResult', id, data)
    streamClosed.current = false
  }

  return (
    <>
      <div className={`absolute w-[80%] max-w-7xl ${result ? 'top-[30%]' : 'top-[50%]'} transition-[top]`}>
        <Sentence selectionsValue={selectionsValue}/>
      </div>
      { result && <div className={'absolute top-[40%] w-[80%] max-w-7xl'}>
          <Result result={result}/>
        </div>}
    </>
  )
}

function Sentence(props: { selectionsValue: Map<string, string> }) {
  const sentence = useAtomValue(sentenceAtom)
  const selections = useAtomValue(selectionAtom)
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
