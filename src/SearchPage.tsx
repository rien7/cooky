import { atom, useAtomValue, useSetAtom } from 'jotai'
import SentenceInput from './components/SentenceInput';
import { useAtom } from 'jotai'
import SelectText from './components/SelectText';
import useDelayUnmount from './utils/delayUnmount';
import { useEffect, useState } from 'react';
import stepCheck, { useShowErrorDot } from './utils/stepCheck';

const stepAtom = atom(0)
const sentenceAtom = atom("")
const selectionAtom = atom<{s: number, e: number}[]>([])
const getErrorAtom = atom(false)

const SearchPage = () => {
  const step = useAtomValue(stepAtom);
  const step1Render = useDelayUnmount(step === 0, 500)
  const step2Render = useDelayUnmount(step === 1, 500)
  const sentence = useAtomValue(sentenceAtom)
  const updateSelectionAtom = useSetAtom(selectionAtom)

  useEffect(() => {
    updateSelectionAtom([])
  }, [sentence, updateSelectionAtom])

  return (
    <>
      <div className={`flex flex-col h-screen justify-center items-center bg-alabaster dark:bg-primary`}>
        <div className='mx-10 w-[80%] absolute'>
          {step1Render && <SentenceInput stepAtom={stepAtom} sentenceAtom={sentenceAtom} getErrorAtom={getErrorAtom}/>}
          {step2Render && <SelectText stepAtom={stepAtom} sentenceAtom={sentenceAtom} selectionAtom={selectionAtom}/>}
        </div>
      </div>
      <div className={`absolute w-48 bottom-32 left-[50%] ${step === 1 ? '-translate-x-[50%]' : step === 2 ? '-translate-x-[calc(100%-1.75rem)]' : '-translate-x-[1.75rem]'} transition`}>
        <div className='relative after:absolute after:inset-x-0 after:top-1/2 after:block after:h-0.5 after:-translate-y-1/2 after:rounded-lg after:bg-platinum dark:after:bg-secondary'>
          <div className={`w-4 h-1 absolute top-1/2 -translate-y-1/2 bg-orange-400 duration-500 z-10 ${step === 1 ? 'left-[5.5rem]' : step === 2 ? 'left-[10.75rem]' : 'left-[0.25rem]' } transition-[left]`}/>
          <div className='relative flex justify-between items-center z-10'>
            {[0, 1, 2].map((i) => <Dot key={i} number={i}/>)}
          </div>
        </div>
      </div>
    </>
  )
}

const Dot = (props: {number: number}) => {
  const [step, setStep] = useAtom(stepAtom)
  const sentence = useAtomValue(sentenceAtom)
  const selection = useAtomValue(selectionAtom)
  const [clickAble, updateClickAble] = useState(false)
  const updateShowErrorDot = useSetAtom(getErrorAtom)
  const errorDotRender = useShowErrorDot(getErrorAtom, 500)

  useEffect(() => {
    updateClickAble(((step === props.number || step + 1 === props.number) && stepCheck(step, sentence, selection)) || (props.number < step && props.number === 0))
  }, [step, sentence, selection, updateClickAble, props.number, clickAble])

  return (
    <>
      {!(errorDotRender && step === props.number) ? 
        <div className={`group flex items-center p-2 h-14 bg-alabaster dark:bg-primary ${clickAble ? 'cursor-pointer' : ''}`} onClick={() => clickAble ? setStep(props.number === step ? props.number + 1 : props.number) : updateShowErrorDot(true)}>
          <div className={`${props.number === step ? ('animate-[scale-80_2s_ease-in-out_infinite_alternate] w-10 h-10 bg-orange-400 outline-orange-400') : 'w-2 h-2 bg-sliver outline-sliver'}
          ${clickAble ? 'group-hover:outline group-hover:outline-2 group-hover:outline-offset-2 running' : 'paused'} rounded-full transition-all`} />
        </div> : 
        <ErrorDot />}
    </>
  )
}

const ErrorDot = () => {
  return (
    <div className={`group flex items-center p-2 h-14 bg-alabaster dark:bg-primary`}>
      <div className={`w-10 h-10 bg-orange-400 rounded-full transition-all animate-[vibrate_0.5s_ease-in-out]`} />
    </div>
  )
}

export default SearchPage