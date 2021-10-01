const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

/**
 * Generate random string of specified length
 * @param length number of characters the output should contain
 * @returns randomly generated string
 */
export const genRandomString = (length: number): string => {
  let result = ''

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return result
}

/**
 * Generate an array containing a specified number of random strings
 * @param listLength length of the array of strings to generate
 * @param sorted (optional) should the generated list be sorted?
 * @returns array of randomly generated strings
 */
export const genMockStringList = (listLength: number, sorted?: boolean): string[] => {
  const strList = Array.from({ length: listLength }, () =>
    genRandomString(10 + Math.ceil(Math.random() * 20))
  )
  if (sorted) strList.sort((a: string, b: string) => a.toLowerCase().localeCompare(b.toLowerCase()))
  return strList
}
