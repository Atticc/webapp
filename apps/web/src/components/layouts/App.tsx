import React from 'react'
import { ColorModeContext } from '@c/layouts/SwitchBox'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { getDesignTokens } from '@app/theme'

type AppProps = {
  children?: React.ReactNode
}

function App({ children }: AppProps) {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light')
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
      },
    }),
    []
  )
  // @ts-ignore
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode])

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <div>{children}</div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default App
