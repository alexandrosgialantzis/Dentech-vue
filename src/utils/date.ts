export const formattedDate = (date: Date) => {
  if (!date) return '--'
  const d = new Date(date)
  return new Intl.DateTimeFormat('el-GR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Europe/Athens'
  }).format(d)
}

export const parseDate = (dateString: string) => {
  if (!dateString) return null
  const parts = dateString.split('/')
  if (parts.length === 3) {
    const [day, month, year] = parts.map((part) => parseInt(part, 10))
    return new Date(year, month - 1, day)
  }
  return null
}

export const isValidDateFormat = (dateString: string) => {
  if (dateString === '--') return true

  const dateFormat = /^\d{2}\/\d{2}\/\d{4}$/

  if (!dateFormat.test(dateString)) {
    return false
  }

  const [day, month, year] = dateString.split('/')

  const dayNum = parseInt(day, 10)
  const monthNum = parseInt(month, 10)
  const yearNum = parseInt(year, 10)

  if (
    dayNum < 1 ||
    dayNum > 31 ||
    monthNum < 1 ||
    monthNum > 12 ||
    yearNum < 2020 ||
    yearNum > 2050
  ) {
    return false
  }

  return true
}
