import { atom, useAtomValue } from 'jotai'
import SentenceInput from './components/SentenceInput';
import { PrimitiveAtom, useAtom } from 'jotai'
import SelectText from './components/SelectText';

const stepAtom = atom(0)
const sentenceAtom = atom("")

const SearchPage = () => {
  const step = useAtomValue(stepAtom);
  return (
    <>
      <div className='flex flex-col h-screen justify-center items-center'>
        <div className='mx-10 w-[80%]'>
          {step === 0 && <SentenceInput stepAtom={stepAtom} sentenceAtom={sentenceAtom} />}
          {step === 1 && <SelectText stepAtom={stepAtom} sentenceAtom={sentenceAtom} />}
        </div>
      </div>
      <div className='absolute w-48 bottom-32 left-[50%] translate-x-[-50%]'>
        <div className='relative after:absolute after:inset-x-0 after:top-1/2 after:block after:h-0.5 after:-translate-y-1/2 after:rounded-lg after:bg-gray-100'>
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
  return (
    <div className='group p-2 bg-white cursor-pointer' onClick={() => setStep(props.number)}>
      <div className={`${props.number === step ? 'w-3 h-3 bg-blue-400' : 
      'w-2 h-2 bg-gray-300 outline-gray-300 group-hover:outline group-hover:outline-2 group-hover:outline-offset-2'} 
      rounded-full transition-all`}></div>
    </div>
  )
}

export default SearchPage