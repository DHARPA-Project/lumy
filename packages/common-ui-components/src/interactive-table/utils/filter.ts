interface IFilter {
  key: string
  type: 'multi-string-include' | 'number-equals' | 'number-greater-than' | 'number-smaller-than'
  value: number | string | string[]
}
interface IFilterObjectListParams {
  objectList: Record<string, number | string | string[]>[]
  filterList: IFilter[]
}

export const getFilteredObjectList = ({
  objectList,
  filterList
}: IFilterObjectListParams): Record<string, number | string | string[]>[] => {
  if (!filterList.length) return objectList

  return objectList.filter(obj =>
    filterList.every(filter => {
      switch (filter.type) {
        case 'multi-string-include':
          if (
            !Array.isArray(filter.value) ||
            !(filter.value as unknown[]).every((value: unknown) => typeof value === 'string')
          ) {
            console.error(
              `Filter ${filter.type} can be used only with filter values of type string or string[]. The provided filter values (${JSON.stringify(filter.value)} do not match the expected filter value type.` //prettier-ignore
            )
            return true
          }
          if (
            !(filter.value as string[]).some((filterValue: string) => {
              const itemValue = obj[filter.key]
              if (typeof itemValue === 'string')
                return itemValue.trim().toLowerCase().includes(filterValue.trim().toLowerCase())
              if (Array.isArray(itemValue) && typeof itemValue[0] === 'string')
                return itemValue.some(str =>
                  str.trim().toLowerCase().includes(filterValue.trim().toLowerCase())
                )
              return false
            })
          ) {
            return false
          }
        default:
          return true
      }
    })
  )
}
