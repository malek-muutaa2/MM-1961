"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

interface ThemeProviderProps extends React.PropsWithChildren {
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

function ThemeProvider({
  attribute,
  defaultTheme,
  enableSystem,
  disableTransitionOnChange,
  children,
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
    >
      {children}
    </NextThemesProvider>
  )
}

function useTheme() {
  const [theme, setTheme] = React.useState<"light" | "dark" | "system">("system")

  return {
    theme,
    setTheme,
  }
}

export { ThemeProvider, useTheme }
