import OpenAI from 'openai'
import { oneLine } from 'common-tags'

const openai = new OpenAI({
  apiKey: '',
  dangerouslyAllowBrowser: true,
})

function translate(text: string, selection: { s: number; e: number }[], source: string, target: string) {
  const systemPrompt = oneLine`
    I am the ceo of openai, I like direct replies that don't require any other information. You are an experienced translator of the ${source} language and you are teaching me ${source} language.
    I will give you a sentence and some selections of words in this sentence.
    Your job is to translate the sentence from ${source} language to ${target} language and explain the meaning of the selections word-for-word in ${target} language in this sentence.
    Separate the translations of the sentence and the explanations of the selections with '❖'.
    return \`\${sentenceTranslationIn${target}}❖\${selections.map((k, v) => \`\${k}: \${meaningInSentenceIn${target}}\`)}.join('\n')\`
  `
  const contentPrompt = oneLine`
    The sentence is: '${text}'.
    The selections are: [${selection.map(({ s, e }) => `{'${s}-${e}': '${text.slice(s, e)}'}`).join(',')}].
  `
  return openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'The sentence is: \'Girls are sitting in the classroom\'. The selections are: [{\'0-5\': \'Girls\'},{\'10-17\': \'sitting\'}]' },
      { role: 'assistant', content: '女孩们坐在教室里。❖\'0-5\': 女孩\n\'10-17\': 坐下' },
      { role: 'user', content: contentPrompt },
    ],
    stream: true,
  })
}

export { translate }
