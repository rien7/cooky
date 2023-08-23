import { setApiKey } from '../../utils/openai'
import { getPromiseMap } from './notificationCallback'

function OpenAIKeyInput(props: { id: string }) {
  const openAIKey = localStorage.getItem('openAIKey') || ''
  function handleKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      setApiKey(e.currentTarget.value)
      localStorage.setItem('openAIKey', e.currentTarget.value)
      getPromiseMap(props.id)?.resolve('')
    }
  }

  return (
    <>
      <input
        defaultValue={openAIKey}
        className="mt-1 block h-[1.5rem] w-full overflow-hidden rounded-md border-2 border-red-500 bg-red-300 px-2 py-4 font-mono text-sm placeholder:text-red-500 focus:outline-none focus:ring-0"
        type="text"
        placeholder="OpenAI Api Key"
        onKeyUp={handleKeyUp}
      />
    </>
  )
}

export { OpenAIKeyInput }
