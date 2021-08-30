import YAML from 'js-yaml'

/**
 * Locale strings should use ICU message syntax (https://unicode-org.github.io/icu/userguide/format_parse/messages/)
 * From https://formatjs.io/docs/core-concepts/basic-internationalization-principles/
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const loadFile = (locale: string): Record<string, unknown> => YAML.load(require(`./${locale}.yml`).default)

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

const supportedLocales = ['en']
const defaultLocale = 'en'

const locales = supportedLocales.reduce((acc, l) => {
  acc[l] = flattenDict(loadFile(l))
  return acc
}, {} as Record<string, Record<string, string>>)

const getLocaleString = (language: string): string => {
  const localeKind = language.split('-')[0].toLowerCase()
  if (supportedLocales.includes(localeKind)) return localeKind
  return defaultLocale
}

const getLocaleMessages = (language: string): Record<string, string> => {
  const locale = getLocaleString(language)
  return locales[locale]
}

export { getLocaleString, getLocaleMessages }
