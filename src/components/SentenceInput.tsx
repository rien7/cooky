import autosize from 'autosize'
import { useRef } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { useEffectOnce } from 'usehooks-ts'
import { errorClickAtom, sentenceAtom, stepAtom } from '../utils/atoms'

function SentenceInput() {
  const ref = useRef<HTMLTextAreaElement>(null)
  const placeholder = 'Input your words'
  const [sentence, setSentence] = useAtom(sentenceAtom)
  const [step, setStep] = useAtom(stepAtom)
  const setErrorClick = useSetAtom(errorClickAtom)

  useEffectOnce(() => {
    autosize(ref.current!)
  })

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setSentence(e.target.value)
    if (e.target.value.endsWith('\n')) {
      e.target.value = e.target.value.slice(0, -1)
      autosize.update(ref.current!)
      setSentence(e.target.value)
      if (sentence.length !== 0)
        setStep(1)
      else
        setErrorClick(true)
    }
  }

  return (
    <>
      <label className={'group relative block w-[80%] max-w-7xl overflow-hidden bg-transparent transition'}>
        <textarea ref={ref} className={`placeholder:text-silver block h-[1.75rem] w-full resize-none overscroll-none scroll-smooth border-none transition duration-500 ${step === 0 ? 'text-primary dark:text-alabaster' : 'text-gray-400'} \
        bg-transparent p-0 font-serif text-xl font-medium focus:border-transparent focus:outline-none focus:ring-0`}
          placeholder={placeholder} onChange={handleChange} defaultValue={sentence}/>
        <span className={'duration-500 after:absolute after:bottom-0 after:left-0 after:block after:h-0.5 after:w-full after:bg-platinum after:transition-[width] dark:after:bg-secondary'}/>
        <span className={'duration-500 after:absolute after:bottom-0 after:left-0 after:block after:h-0.5 after:w-0 after:bg-orange-400 after:transition-[width] after:group-focus-within:w-full'}/>
        <span className={`duration-500 after:absolute after:bottom-0 after:left-0 after:block after:h-0.5 after:bg-alabaster after:transition-[width] dark:after:bg-primary ${step !== 0 ? 'after:w-full after:group-focus-within:w-full' : 'after:w-0'}`}/>
      </label>
    </>
  )
}

export default SentenceInput
