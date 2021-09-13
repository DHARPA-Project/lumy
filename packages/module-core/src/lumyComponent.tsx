import React from 'react'
import {
  registerLumyComponent,
  getResolvedReactComponent,
  ComponentWithMockProcessor
} from '@lumy/client-core'
import { createGenerateClassName, StylesProvider } from '@material-ui/styles'
import { ThemeContextProvider, useUserLanguageCode } from '@lumy/styles'

/**
 * Register Lumy component under a specified ID.
 * Namespace CSS classes under a uniq prefix created from the ID.
 */
export function lumyComponent(id: string) {
  return <T,>(Component: React.FC<T>): React.FC<T> => {
    const [language] = useUserLanguageCode()
    const generateClassName = createGenerateClassName({
      productionPrefix: `${id}-`,
      disableGlobal: false,
      seed: `${id}-`
    })

    const enrichedComponent = (props: T) => (
      <StylesProvider generateClassName={generateClassName}>
        <ThemeContextProvider locale={language}>
          <Component {...props} />
        </ThemeContextProvider>
      </StylesProvider>
    )

    // hoist mock processor up to the wrapper
    Object.defineProperty(enrichedComponent, 'mockProcessor', {
      get: async function () {
        const resolvedComponent = await getResolvedReactComponent<
          ComponentWithMockProcessor<unknown, unknown>,
          T
        >(Component)

        return resolvedComponent?.mockProcessor
      }
    })

    registerLumyComponent(id, enrichedComponent)
    return enrichedComponent
  }
}
