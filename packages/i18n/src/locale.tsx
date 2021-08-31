import React from 'react'
import YAML from 'js-yaml'
import { IntlProvider, useIntl, FormattedMessage, IntlShape } from 'react-intl'

/**
 * Locale strings should use ICU message syntax (https://unicode-org.github.io/icu/userguide/format_parse/messages/)
 * From https://formatjs.io/docs/core-concepts/basic-internationalization-principles/
 */

const isObject = (obj: unknown): obj is Record<string, unknown> =>
  typeof obj === 'object' && obj !== null && !Array.isArray(obj)

const flattenDict = (dict: Record<string, unknown>): Record<string, string> => {
  const res: Record<string, string> = {}

  const reduce = (obj: unknown, prefix: string | undefined = undefined): Record<string, string> => {
    if (Array.isArray(obj)) {
      obj.forEach((v, idx) => reduce(v, prefix == null ? String(idx) : [prefix, idx].join('.')))
    } else if (isObject(obj)) {
      Object.keys(obj).forEach(k => reduce(obj[k], prefix == null ? k : [prefix, k].join('.')))
    } else {
      res[prefix] = String(obj)
    }
    return res
  }

  return reduce(dict)
}

const defaultLocale = 'en'

type GetLocaleStringFn = (language: string) => string
type GetLocaleMessagesFn = (language: string) => Record<string, string>

/** locale name => locale file content (YAML format) */
type LocaleLookup = Record<string, string>

const localeFactory = (localeLookup: LocaleLookup): [GetLocaleStringFn, GetLocaleMessagesFn] => {
  const locales = Object.keys(localeLookup)

  const messagesByLocale = locales.reduce((acc, l) => {
    acc[l] = flattenDict(YAML.load(localeLookup[l]))
    return acc
  }, {} as Record<string, Record<string, string>>)

  const getLocaleString = (language: string): string => {
    const localeKind = language.split('-')[0].toLowerCase()
    if (locales.includes(localeKind)) return localeKind
    return defaultLocale
  }

  const getLocaleMessages = (language: string): Record<string, string> => {
    const locale = getLocaleString(language)
    return messagesByLocale[locale]
  }

  return [getLocaleString, getLocaleMessages]
}

const localeContextFactory = (localeLookup: LocaleLookup) => {
  return <P,>(Component: React.ComponentType<P>): React.ComponentType<P> => {
    const WrappedComponent: React.ComponentType<P> = (props: P) => {
      const intl = useIntl()
      const locale = intl?.locale

      const [getLocaleString, getLocaleMessages] = localeFactory(localeLookup)
      return (
        <IntlProvider locale={getLocaleString(locale)} messages={getLocaleMessages(locale)}>
          <Component {...props} />
        </IntlProvider>
      )
    }
    WrappedComponent.displayName = Component.displayName

    return WrappedComponent
  }
}

export { localeFactory, localeContextFactory, IntlProvider, FormattedMessage, useIntl }
export type { IntlShape }
