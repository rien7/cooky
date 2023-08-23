import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { oneLine } from 'common-tags'
import SentenceInput from './components/SentenceInput'
import SelectText from './components/SelectText'
import useDelayUnmount from './utils/delayUnmount'
import { useShowErrorDot } from './utils/useShowErrorDot'
import ResultPresent from './components/ResultPresent'
import { errorClickAtom, selectionErrorAtom, sentenceErrorAtom, stepAtom } from './utils/atoms'

function SearchPage() {
  const step = useAtomValue(stepAtom)
  const step0Render = useDelayUnmount(step === 0, 500)
  const step1Render = useDelayUnmount(step === 1, 500)

  return (
    <>
      <div className={'flex h-screen flex-col items-center justify-center bg-alabaster dark:bg-primary'}>
        <div className='w-[80%] max-w-7xl transition-all'>
          {step0Render && <SentenceInput />}
          {step1Render && <SelectText />}
          {step === 2 && <ResultPresent />}
        </div>
      </div>
      <div className={`absolute bottom-32 left-[50%] w-48 ${step === 1 ? 'translate-x-[-50%]' : step === 2 ? 'translate-x-[calc(-100%+1.75rem)]' : 'translate-x-[-1.75rem]'} transition`}>
        <div className='relative after:absolute after:inset-x-0 after:top-1/2 after:block after:h-0.5 after:-translate-y-1/2 after:rounded-lg after:bg-platinum dark:after:bg-secondary'>
          <div className={`absolute top-1/2 z-10 h-1 w-4 -translate-y-1/2 bg-orange-400 duration-500 ${step === 1 ? 'left-[5.5rem]' : step === 2 ? 'left-[10.75rem]' : 'left-[0.25rem]'} transition-[left]`}/>
          <div className='relative z-10 flex items-center justify-between'>
            {[0, 1, 2].map(i => step === i ? <HighlightDot key={i}/> : <Dot key={i} i={i}/>)}
          </div>
        </div>
      </div>
    </>
  )
}

function Dot(props: { i: number }) {
  const [step, setStep] = useAtom(stepAtom)
  const sentenceError = useAtomValue(sentenceErrorAtom)
  const selectionError = useAtomValue(selectionErrorAtom)
  const setErrorClick = useSetAtom(errorClickAtom)

  const stepClickable = props.i === 0 || (props.i === 1 && step === 0) || (props.i === 2 && step === 1)

  function handleClick() {
    if (stepClickable && ((step === 0 && !sentenceError) || (step === 1 && !selectionError) || (props.i < step)))
      setStep(props.i)
    else if (props.i > step)
      setErrorClick(true)
  }

  return (
    <>
      <div className={`group flex h-14 items-center bg-alabaster p-2 dark:bg-primary ${stepClickable ? 'cursor-pointer' : ''}`} onClick={handleClick}>
        <div className={`h-2 w-2 rounded-full bg-sliver outline-sliver transition-all ${stepClickable ? 'group-hover:outline group-hover:outline-2 group-hover:outline-offset-2' : ''}`} />
      </div>
    </>
  )
}

function HighlightDot() {
  const [step, setStep] = useAtom(stepAtom)
  const sentenceError = useAtomValue(sentenceErrorAtom)
  const selectionError = useAtomValue(selectionErrorAtom)
  const setErrorClick = useSetAtom(errorClickAtom)
  const errorDotRender = useShowErrorDot(errorClickAtom, 500)

  function handleClick() {
    if (step === 0 && !sentenceError)
      setStep(1)
    else if (step === 1 && !selectionError)
      setStep(2)
    else
      setErrorClick(true)
  }

  return (
    <>
      {!errorDotRender
        ? <div className={'group flex h-14 cursor-pointer items-center bg-alabaster p-2 dark:bg-primary'} onClick={handleClick}>
          <div className={oneLine`h-10 w-10 animate-[scale-80_2s_ease-in-out_infinite_alternate] bg-orange-400 outline-orange-400 rounded-full transition-all group-hover:outline group-hover:outline-2 group-hover:outline-offset-2
          ${(!sentenceError && !selectionError && step !== 2) ? 'running' : 'paused'}`} />
        </div>
        : <ErrorDot />
      }
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
