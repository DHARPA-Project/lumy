import { formatDistance } from 'date-fns'
import * as FnsLocale from 'date-fns/locale'
import micromark from 'micromark'
import { useUserLanguageCode } from '@lumy/i18n'

type FnsSupportedLocales = keyof typeof FnsLocale

export const asTimeAgo = (date: Date): string => {
  if (date == null) return undefined
  const [code] = useUserLanguageCode()
  const currentFnsLocale = FnsLocale[code as FnsSupportedLocales]
  return formatDistance(date, new Date(), { addSuffix: true, locale: currentFnsLocale })
}
export const asHtml = (markdown: string): string => micromark(markdown)
