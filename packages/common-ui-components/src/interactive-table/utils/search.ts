interface IFilterObjectListParams {
  objectList: Record<string, number | string | string[]>[]
  keysToSearch?: string[]
  searchQuery: string
}

export const getSearchedObjectList = ({
  objectList,
  keysToSearch = ['label'],
  searchQuery
}: IFilterObjectListParams): Record<string, number | string | string[]>[] => {
  if (!searchQuery || !keysToSearch.length) return objectList

  return (objectList ?? []).filter(item =>
    keysToSearch.some(key => {
      const itemValue = item[key]
      if (typeof itemValue === 'string') return itemValue.toLowerCase().includes(searchQuery)
      return false
    })
  )
}
