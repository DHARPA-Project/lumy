import { formatDistance } from 'date-fns'
import micromark from 'micromark'

export const asTimeAgo = (date: Date): string => formatDistance(date, new Date(), { addSuffix: true })
export const asHtml = (markdown: string): string => micromark(markdown)
