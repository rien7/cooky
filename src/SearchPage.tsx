import { atom, useAtomValue } from 'jotai'
import SentenceInput from './components/SentenceInput';
import { PrimitiveAtom, useAtom } from 'jotai'
import SelectText from './components/SelectText';
import useDelayUnmount from './utils/delayUnmount';

const stepAtom = atom(0)
const sentenceAtom = atom("")
const selectionAtom = atom<{s: number, e: number}[]>([])

const SearchPage = () => {
  const step = useAtomValue(stepAtom);
  const step1Render = useDelayUnmount(step === 0, 500)
  const step2Render = useDelayUnmount(step === 1, 500)

  return (
    <>
      <div className='flex flex-col h-screen justify-center items-center bg-alabaster'>
        <div className='mx-10 w-[80%] absolute'>
          {step1Render && <SentenceInput stepAtom={stepAtom} sentenceAtom={sentenceAtom} />}
          {step2Render && <SelectText stepAtom={stepAtom} sentenceAtom={sentenceAtom} selectionAtom={selectionAtom}/>}
        </div>
      </div>
      <div className='absolute w-48 bottom-32 left-[50%] translate-x-[-50%]'>
        <div className='relative after:absolute after:inset-x-0 after:top-1/2 after:block after:h-1 after:-translate-y-1/2 after:rounded-lg after:bg-platinum'>
          <div className={`w-4 h-1 absolute top-1/2 -translate-y-1/2 bg-orange-400 duration-500 z-10 ${step === 1 ? 'left-[5.5rem]' : step === 2 ? 'left-[10.75rem]' : 'left-[0.25rem]' } transition-[left]`}/>
          <div className='relative flex justify-between items-center z-10'>
            {[0, 1, 2].map((i) => <Dot key={i} number={i} stepAtom={stepAtom}/>)}
          </div>
        </div>
      </div>
    </>
  )
}

const Dot = (props: {number: number, stepAtom: PrimitiveAtom<number>}) => {
  const [step, setStep] = useAtom(props.stepAtom)
  const clickAble = (props.number === 0 || step + 1 === props.number) && props.number != step
  return (
    <div className={`group p-2 bg-alabaster ${clickAble && 'cursor-pointer'}`} onClick={() => clickAble && setStep(props.number)}>
      <div className={`w-2 h-2 delay-200 ${props.number === step ? 'scale-150 bg-orange-400' : ' bg-sliver outline-sliver'} ${clickAble && 'group-hover:outline group-hover:outline-2 group-hover:outline-offset-2'} \
      rounded-full transition-all`} />
    </div>
  )
}

export default SearchPage