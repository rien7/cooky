import autosize from "autosize";
import { useEffect, useRef } from "react";
import { PrimitiveAtom, useSetAtom, useAtom } from 'jotai'

const SentenceInput = (props: { stepAtom: PrimitiveAtom<number>, sentenceAtom: PrimitiveAtom<string> }) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const placeholder = "Input your words"
  const [sentence, updateSentence] = useAtom(props.sentenceAtom)
  const updateStep = useSetAtom(props.stepAtom)

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
    <label className="relative block overflow-hidden border-b-2 border-gray-200 bg-transparent focus-within:border-blue-600 transition">
      <textarea ref={ref} className="block scroll-smooth overscroll-none resize-none max-h-[8.75rem] h-[1.75rem] w-full border-none bg-transparent p-0 focus:border-transparent focus:outline-none focus:ring-0 text-xl font-medium font-serif"
         placeholder={placeholder} onChange={handleChange} defaultValue={sentence}/>
    </label>
    </>
  )
}

export default SentenceInput;