import { DataRepositoryItemsFilter, TabularDataFilter } from '../types'

export function getHash(filter?: TabularDataFilter): string {
  if (filter == null) return ''
  // return [filter.fullValue, filter.offset, filter.pageSize].join(':')
  // TODO: use https://www.npmjs.com/package/object-hash or consider each field
  return JSON.stringify(filter)
}

export function getDataRepositoryItemsFilterHash(filter?: DataRepositoryItemsFilter): string {
  if (filter == null) return ''
  return [filter.offset, filter.pageSize].join(':')
}
