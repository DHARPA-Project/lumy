interface ISortObjectListParams {
  objectList: Record<string, number | string | string[]>[]
  propertyToSortBy: string
  sortingOrder: 'asc' | 'desc'
  isNumeric: boolean
}

export const getSortedObjectList = ({
  objectList,
  propertyToSortBy,
  isNumeric,
  sortingOrder
}: ISortObjectListParams): Record<string, number | string | string[]>[] => {
  const orderFactor = sortingOrder === 'asc' ? 1 : -1
  return objectList.sort((a, b) => {
    const first = isNumeric
      ? parseFloat(a[propertyToSortBy] as string)
      : (a[propertyToSortBy] as string).trim().toLowerCase()
    const second = isNumeric
      ? parseFloat(b[propertyToSortBy] as string)
      : (b[propertyToSortBy] as string).trim().toLowerCase()
    return first > second ? orderFactor : -orderFactor
  })
}
