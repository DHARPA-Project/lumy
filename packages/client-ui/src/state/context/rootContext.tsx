import React from 'react'

import { IntlProvider } from 'react-intl'
import { ThemeContextProvider as ThemeProvider, useUserLanguageCode } from '@lumy/styles'

import { NotificationProvider } from './notificationContext'
import { LayoutProvider } from './layoutContext'
import { ProjectProvider } from './projectContext'
import { getLocaleString, getLocaleMessages } from '../../locale'

export const RootProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [language] = useUserLanguageCode()

  return (
    <IntlProvider locale={getLocaleString(language)} messages={getLocaleMessages(language)}>
      <ThemeProvider locale={language}>
        <LayoutProvider>
          <NotificationProvider>
            <ProjectProvider>
              {children}
              {/* prettier-ignore */}
            </ProjectProvider>
          </NotificationProvider>
        </LayoutProvider>
      </ThemeProvider>
    </IntlProvider>
  )
}
