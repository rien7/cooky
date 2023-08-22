export default function renderSelection(selections: { s: number; e: number }[], text: string, style?: { default?: string; highlight?: string }) {
  const result: { class?: string; text: string }[] = []
  let last = 0
  selections.sort((a, b) => a.s - b.s)
  for (const selection of selections) {
    result.push({ class: style?.default, text: text.slice(last, selection.s) })
    result.push({ class: style?.highlight, text: text.slice(selection.s, selection.e) })
    last = selection.e
  }
  result.push({ class: style?.default, text: text.slice(last) })
  return result
}
