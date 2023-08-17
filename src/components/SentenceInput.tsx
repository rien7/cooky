import autosize from "autosize";
import { useEffect, useRef } from "react";

const SentenceInput = () => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const placeholder = "Input your words"

  useEffect(() => {
    autosize(ref.current!);
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (e.target.value.endsWith("\n")) {
      e.target.value = e.target.value.slice(0, -1)
      autosize.update(ref.current!)
    }
  }

  return (
    <>
    <label className="relative block overflow-hidden border-b-2 border-gray-200 bg-transparent focus-within:border-blue-600 transition">
      <textarea ref={ref} className="scroll-smooth overscroll-none resize-none max-h-[8.75rem] h-[1.75rem] w-full border-none bg-transparent p-0 focus:border-transparent focus:outline-none focus:ring-0 text-xl font-medium font-serif"
         placeholder={placeholder} onChange={handleChange}/>
    </label>
    </>
  )
}

export default SentenceInput;