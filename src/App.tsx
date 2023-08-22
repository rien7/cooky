import { atom, useAtom } from 'jotai'
import './index.css'
import { useEffect } from 'react'
import SearchPage from './SearchPage'

const darkModeAtom = atom(false)

function App() {
  const [darkMode, updateDarkMode] = useAtom(darkModeAtom)

  useEffect(() => {
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (event) => {
        if (event.matches)
          updateDarkMode(true)
        else
          updateDarkMode(false)
      })
  }, [updateDarkMode])

  return (
    <div className={darkMode ? 'dark' : undefined}>
      <SearchPage />
    </div>
  )
}

export default App
