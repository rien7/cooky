import { atom, useAtom } from 'jotai'
import './index.css'
import { useEffectOnce } from 'usehooks-ts'
import { Analytics } from '@vercel/analytics/react'
import SearchPage from './SearchPage'
import NotificationCenter from './components/notification/NotificationCenter'

const darkModeAtom = atom(false)

function App() {
  const [darkMode, setDarkMode] = useAtom(darkModeAtom)

  useEffectOnce(() => {
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (event) => {
        if (event.matches)
          setDarkMode(true)
        else
          setDarkMode(false)
      })
  })

  return (
    <>
      <div className={darkMode ? 'dark' : undefined}>
        <SearchPage />
        <NotificationCenter />
      </div>
      <Analytics />
    </>
  )
}

export default App
