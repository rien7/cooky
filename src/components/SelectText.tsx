import { useAtom, useAtomValue } from 'jotai'
import { useRef } from 'react'
import { useEffectOnce } from 'usehooks-ts'
import renderSelection from '../utils/renderSelection'
import { selectionAtom, sentenceAtom, stepAtom } from '../utils/atoms'

function mergeSelection(selections: { s: number; e: number }[]): { s: number; e: number }[] {
  selections.sort((a, b) => a.s - b.s)
  const merged: { s: number; e: number }[] = []
  let last = selections[0]
  for (let i = 1; i < selections.length; i++) {
    if (selections[i].s <= last.e) {
      last.e = Math.max(last.e, selections[i].e)
    }
    else {
      merged.push(last)
      last = selections[i]
    }
  }
  merged.push(last)
  return merged
}

// TODO: support phrase selection
// TODO: remove space and other symbols
function SelectText() {
  const ref = useRef<HTMLParagraphElement>(null)
  const sentence = useAtomValue(sentenceAtom)
  const step = useAtomValue(stepAtom)
  const [selections, setSelections] = useAtom(selectionAtom)

  useEffectOnce(() => {
    setSelections([])
  })

  // get children nodes offset
  function getOffset() {
    const dom = ref.current
    if (!dom)
      return
    const children = dom.childNodes
    const offset: Map<string | null, number> = new Map()
    let last = 0
    for (let i = 0; i < children.length; i++) {
      offset.set(children[i].textContent, last)
      last += children[i].textContent!.length
    }
    return offset
  }

  function onMouseUpHandler() {
    const selectionObj: Selection | null = (window.getSelection && window.getSelection())
    if (!selectionObj)
      return

    const selection = selectionObj.toString()
    const anchorNode = selectionObj.anchorNode
    const focusNode = selectionObj.focusNode
    const anchorOffset = selectionObj.anchorOffset
    const focusOffset = selectionObj.focusOffset
    if (!anchorNode || !focusNode)
      return

    const offsets = getOffset()
    if (!offsets)
      return

    // if selection is collapsed, remove selection
    if (selectionObj.isCollapsed) {
      const offset = offsets.get(anchorNode.textContent) || 0
      for (const item of selections) {
        if (item.s <= anchorOffset + offset && anchorOffset + offset <= item.e) {
          setSelections(selections.filter(i => i !== item))
          return
        }
      }
    }

    const position = anchorNode.compareDocumentPosition(focusNode)
    let forward = false
    if (position === anchorNode.DOCUMENT_POSITION_FOLLOWING) {
      forward = true
    }
    else if (position === 0) { // same node
      forward = (focusOffset - anchorOffset) > 0
    }

    const anchorNodeOffset = offsets.get(anchorNode.textContent) || 0
    const focusNodeOffset = offsets.get(focusNode.textContent) || 0

    const selectionStart = forward ? anchorOffset + anchorNodeOffset : focusOffset + focusNodeOffset
    const selectionEnd = selectionStart + selection.length

    const mergedSelections = mergeSelection([...selections, { s: selectionStart, e: selectionEnd }])
    setSelections(mergedSelections)
  }

  return (
    <>
      <label className={`relative block w-[80%] max-w-7xl overflow-hidden border-transparent bg-transparent ${step === 1 ? 'z-10' : 'z-20'}`}>
        <p ref={ref} className={`selection w-full cursor-text border-none bg-transparent p-0 font-serif text-xl font-medium transition duration-500 ${step === 1 ? 'text-gray-400' : 'text-primary dark:text-alabaster'}`} onMouseUp={onMouseUpHandler}>
          {renderSelection(selections, sentence, { default: 'whitespace-pre-wrap', highlight: 'text-orange-400 cursor-pointer whitespace-pre-wrap' }).map((item, index) => (
            <span className={item.class} key={index}>{item.text}</span>
          ))}
        </p>
      </label>
    </>
  )
}

export default SelectText
