import * as locales from '@material-ui/core/locale'

type SupportedLocale = keyof typeof locales

const DefaultLocale: SupportedLocale = 'enUS'

const languageToMuiLocale = (language: Navigator['language']): SupportedLocale => {
  // E.g. 'en-US' => 'enUS' (see https://material-ui.com/guides/localization/#supported-locales)
  const languageImportName = language?.replaceAll('-', '')
  if (languageImportName in locales) return languageImportName as SupportedLocale

  // otherwise try to pick the first of the kind, e.g. 'en-GB' => 'enUS'
  const languageKind = language?.split('-')[0]
  for (const locale of Object.keys(locales)) {
    if (locale.startsWith(languageKind)) return locale as SupportedLocale
  }

  // fall back to default locale
  return DefaultLocale
}

const localStorageLanguageCodeKey = '__lumy_languageCode'

const useUserLanguageCode = (): [Navigator['language'], (code: Navigator['language']) => void] => {
  const code = localStorage.getItem(localStorageLanguageCodeKey) ?? navigator.language
  const setCode = (code: Navigator['language']) => {
    if (code != null) localStorage.setItem(localStorageLanguageCodeKey, code)
    else localStorage.removeItem(localStorageLanguageCodeKey)
  }

  return [code, setCode]
}

export { locales, languageToMuiLocale, useUserLanguageCode }
export type { SupportedLocale }
