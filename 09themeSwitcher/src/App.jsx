import { useState } from 'react'
import './App.css'
import useTheme, { ThemeProvider } from './contexts/Theme'
import ThemeBtn from './components/ThemeBtn'
import Card from './components/Card'
import { useEffect } from 'react'

function App() {

  const [themeMode, setThemeMode] = useState("light")

  const lightTheme = () => {
    setThemeMode("light")
  }

  const darkTheme = () => {
    setThemeMode("dark")
  }

  // actual change in theme

  useEffect(() => {
    document.querySelector('html').classNameNameList.remove("light", "dark")
    document.querySelector('html').classNameNameList.add(themeMode)
  }, [themeMode])

  return (
   <ThemeProvider value={{themeMode,lightTheme,darkTheme}}>
      <ThemeBtn/>
      <Card/>
   </ThemeProvider>
  )
}

export default App
