const weekDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const weeklyStats: Record<string, number> = {
  mon: 800,
  tue: 1000,
  wed: 1200,
  thu: 1400,
  fri: 1200,
  sat: 300,
  sun: 200
}

interface IChartPoint {
  day: string
  amount: number
}

const getDataToDisplay = (): IChartPoint[] => {
  const now = new Date()

  // iterate through last 7 days and display data from weeklyStats for each day key
  return Array.from({ length: 7 }, (_, i) => 6 - i).map(daysAgo => {
    const newDate = new Date()
    newDate.setDate(now.getDate() - daysAgo)
    const weekDayName = weekDayNames[newDate.getDay()]

    return {
      day: `${newDate.getFullYear()}/${newDate.getMonth()}/${newDate.getDate()}, ${weekDayName}`,
      amount: weeklyStats[weekDayName.toLowerCase()]
    }
  })
}

export default getDataToDisplay
