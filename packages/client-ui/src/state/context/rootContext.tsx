import React from 'react'

import { ThemeContextProvider as ThemeProvider } from '@lumy/styles'

import { NotificationProvider } from './notificationContext'
import { LayoutProvider } from './layoutContext'
import { ProjectProvider } from './projectContext'

export const RootProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
    <ThemeProvider>
      <LayoutProvider>
        <NotificationProvider>
          <ProjectProvider>
            {children}
            {/* prettier-ignore */}
          </ProjectProvider>
        </NotificationProvider>
      </LayoutProvider>
    </ThemeProvider>
  )
}
