import autosize from 'autosize'
import { useEffect, useRef } from 'react'
import type { PrimitiveAtom } from 'jotai'
import { useAtom, useSetAtom } from 'jotai'

function SentenceInput(props: { stepAtom: PrimitiveAtom<number>; sentenceAtom: PrimitiveAtom<string>; selectionAtom: PrimitiveAtom<{ s: number; e: number }[]>; errorClickAtom: PrimitiveAtom<boolean> }) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const placeholder = 'Input your words'
  const [sentence, setSentence] = useAtom(props.sentenceAtom)
  const [step, setStep] = useAtom(props.stepAtom)
  const setSelections = useSetAtom(props.selectionAtom)
  const setErrorClick = useSetAtom(props.errorClickAtom)

  useEffect(() => {
    autosize(ref.current!)
  }, [])

  useEffect(() => {
    setSelections([])
  }, [setSelections])

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
      <label className={`group absolute block w-[80%] max-w-7xl overflow-hidden bg-transparent transition ${step === 0 ? 'z-10' : 'z-20'} translate-y-[-50%]`}>
        <textarea ref={ref} className={`placeholder:text-silver block h-[1.75rem] w-full resize-none overscroll-none scroll-smooth border-none transition duration-500 ${step === 0 ? 'text-primary opacity-100 dark:text-alabaster' : 'text-gray-400 opacity-0'} \
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
