import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import SentenceInput from './components/SentenceInput'
import SelectText from './components/SelectText'
import useDelayUnmount from './utils/delayUnmount'
import stepCheck, { useShowErrorDot } from './utils/stepCheck'
import ResultPresent from './components/ResultPresent'

const stepAtom = atom(0)
const sentenceAtom = atom('')
const selectionAtom = atom<{ s: number; e: number }[]>([])
const resultAtom = atom('')
const getErrorAtom = atom(false)

function SearchPage() {
  const step = useAtomValue(stepAtom)
  const step0Render = useDelayUnmount(step === 0, 500)
  const step1Render = useDelayUnmount(step === 1, 500)
  const sentence = useAtomValue(sentenceAtom)
  const setSelectionAtom = useSetAtom(selectionAtom)

  useEffect(() => {
    setSelectionAtom([])
  }, [sentence, setSelectionAtom])

  return (
    <>
      <div className={'flex h-screen flex-col items-center justify-center bg-alabaster dark:bg-primary'}>
        <div className='w-[80%] max-w-7xl transition-all'>
          {step0Render && <SentenceInput stepAtom={stepAtom} sentenceAtom={sentenceAtom} getErrorAtom={getErrorAtom}/>}
          {step1Render && <SelectText stepAtom={stepAtom} sentenceAtom={sentenceAtom} selectionAtom={selectionAtom}/>}
          {step === 2 && <ResultPresent sentenceAtom={sentenceAtom} selectionAtom={selectionAtom} resultAtom={resultAtom}/>}
        </div>
      </div>
      <div className={`absolute bottom-32 left-[50%] w-48 ${step === 1 ? 'translate-x-[-50%]' : step === 2 ? 'translate-x-[-calc(100%-1.75rem)]' : 'translate-x-[-1.75rem]'} transition`}>
        <div className='relative after:absolute after:inset-x-0 after:top-1/2 after:block after:h-0.5 after:-translate-y-1/2 after:rounded-lg after:bg-platinum dark:after:bg-secondary'>
          <div className={`absolute top-1/2 z-10 h-1 w-4 -translate-y-1/2 bg-orange-400 duration-500 ${step === 1 ? 'left-[5.5rem]' : step === 2 ? 'left-[10.75rem]' : 'left-[0.25rem]'} transition-[left]`}/>
          <div className='relative z-10 flex items-center justify-between'>
            {[0, 1, 2].map(i => <Dot key={i} number={i}/>)}
          </div>
        </div>
      </div>
    </>
  )
}

function Dot(props: { number: number }) {
  const [step, setStep] = useAtom(stepAtom)
  const sentence = useAtomValue(sentenceAtom)
  const selection = useAtomValue(selectionAtom)
  const [clickAble, setClickAble] = useState(false)
  const setShowErrorDot = useSetAtom(getErrorAtom)
  const errorDotRender = useShowErrorDot(getErrorAtom, 500)

  useEffect(() => {
    setClickAble(((step === props.number || step + 1 === props.number) && stepCheck(step, sentence, selection)) || (props.number < step && props.number === 0))
  }, [step, sentence, selection, setClickAble, props.number, clickAble])

  return (
    <>
      {!(errorDotRender && step === props.number)
        ? <div className={`group flex h-14 items-center bg-alabaster p-2 dark:bg-primary ${clickAble ? 'cursor-pointer' : ''}`} onClick={() => clickAble ? setStep(props.number === step ? props.number + 1 : props.number) : setShowErrorDot(true)}>
          <div className={`${props.number === step ? ('h-10 w-10 animate-[scale-80_2s_ease-in-out_infinite_alternate] bg-orange-400 outline-orange-400') : 'h-2 w-2 bg-sliver outline-sliver'}
          ${clickAble ? 'running group-hover:outline group-hover:outline-2 group-hover:outline-offset-2' : 'paused'} rounded-full transition-all`} />
        </div>
        : <ErrorDot />}
    </>
  )
}

function ErrorDot() {
  return (
    <div className={'group flex h-14 items-center bg-alabaster p-2 dark:bg-primary'}>
      <div className={'h-10 w-10 animate-[vibrate_0.5s_ease-in-out] rounded-full bg-orange-400 transition-all'} />
    </div>
  )
}

export default SearchPage
