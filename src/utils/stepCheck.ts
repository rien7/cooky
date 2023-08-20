export default function stepCheck(step: number, sentence?: string, selection?: {s: number, e: number}[]) {
  switch (step) {
    case 0:
      return sentence ? sentence.length !== 0 : false;
    case 1:
      return selection ? selection.length !== 0 : false;
    default:
      return false;
  }
}