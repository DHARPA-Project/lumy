const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

export const getCurrentDate = (date = new Date()): string => {
  const dateDay = date.getDate()
  const dateSuperscript = dateDay === 1 ? 'st' : dateDay === 2 ? 'nd' : dateDay === 3 ? 'rd' : 'th'
  return `${dateDay}${dateSuperscript} of ${monthNames[date.getMonth()]}, ${date.getFullYear()}`
}
