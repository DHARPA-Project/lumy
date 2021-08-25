import React from 'react'

import { ThemeContextProvider as ThemeProvider } from '@lumy/styles'

import { LayoutProvider } from './layoutContext'
import { ProjectProvider } from './projectContext'

export const RootProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
    <ThemeProvider>
      <LayoutProvider>
        <ProjectProvider>
          {children}
          {/* prettier-ignore */}
        </ProjectProvider>
      </LayoutProvider>
    </ThemeProvider>
  )
}
