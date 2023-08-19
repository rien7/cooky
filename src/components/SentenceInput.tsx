import autosize from "autosize";
import { useEffect, useRef } from "react";
import { PrimitiveAtom, useAtom } from 'jotai'

const SentenceInput = (props: { stepAtom: PrimitiveAtom<number>, sentenceAtom: PrimitiveAtom<string> }) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const placeholder = "Input your words"
  const [sentence, updateSentence] = useAtom(props.sentenceAtom)
  const [step, updateStep] = useAtom(props.stepAtom)

  useEffect(() => {
    autosize(ref.current!);
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (e.target.value.endsWith("\n")) {
      e.target.value = e.target.value.slice(0, -1)
      autosize.update(ref.current!)
      updateSentence(e.target.value)
      updateStep(1)
    }
  }

  return (
    <>
      <label className={`group absolute w-full block overflow-hidden bg-transparent transition ${step === 0 ? 'z-10' : 'z-20'} -translate-y-[50%]`}>
        <textarea ref={ref} className={` block scroll-smooth overscroll-none resize-none h-[1.75rem] w-full border-none placeholder-silver transition duration-500 ${step === 0 ? 'text-primary opacity-100' : 'text-gray-400 opacity-0'} \
        bg-transparent p-0 focus:border-transparent focus:outline-none focus:ring-0 text-xl font-medium font-serif`}
          placeholder={placeholder} onChange={handleChange} defaultValue={sentence}/>
        <span className={`after:transition-[width] after:block after:absolute after:bg-platinum after:h-0.5 after:w-full after:left-0 after:bottom-0 duration-500`}/>
        <span className={`after:transition-[width] after:block after:absolute after:bg-orange-400 after:h-0.5 after:left-0 after:bottom-0 duration-500 after:w-0 after:group-focus-within:w-full`}/>
        <span className={`after:transition-[width] after:block after:absolute after:bg-alabaster after:h-0.5 after:left-0 after:bottom-0 duration-500 ${step !== 0 ? 'after:w-full after:group-focus-within:w-full' : 'after:w-0'}`}/>
      </label>
    </>
  )
}

export default SentenceInput;