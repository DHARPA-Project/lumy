import { localeFactory } from '@lumy/i18n'
import en from './en.yml'

const [getLocaleString, getLocaleMessages] = localeFactory({ en })

export { getLocaleString, getLocaleMessages }
