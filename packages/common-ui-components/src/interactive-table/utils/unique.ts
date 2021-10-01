/**
 * Function that loops through a list of objects, identifies the value corresponding to...
 * ...the specified key in each object, and returns these results as a set of unique values
 * @param objectList list of objects, each one containing the specified property
 * @param key property/key to query in each object of the provided list
 * @returns an array containing all the unique values
 */
export const extractListUniqueValues = (objectList: Record<string, unknown>[], key: string): unknown[] => {
  const optionSet = new Set()
  objectList.forEach(object => {
    const value = object[(key as unknown) as string]
    if (value == null) return
    if (Array.isArray(value)) {
      value.forEach(item => optionSet.add(typeof item === 'string' ? item : JSON.stringify(item)))
    } else {
      optionSet.add(value)
    }
  })
  return [...optionSet]
}
