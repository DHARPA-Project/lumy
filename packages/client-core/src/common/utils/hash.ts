import { TabularDataFilter } from '../types'

export function getHash(filter?: TabularDataFilter): string {
  if (filter == null) return ''
  return [filter.fullValue, filter.offset, filter.pageSize].join(':')
}
