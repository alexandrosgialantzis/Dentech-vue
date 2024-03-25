import { OrderStatus } from '../types/enums'
import { GroupedOrdersResult, Order } from '../types/interfaces'

const monthNamesToNumbers: Record<string, number> = {
  Ιανουαρίου: 1,
  Φεβρουαρίου: 2,
  Μαρτίου: 3,
  Απριλίου: 4,
  Μαΐου: 5,
  Ιουνίου: 6,
  Ιουλίου: 7,
  Αυγούστου: 8,
  Σεπτεμβρίου: 9,
  Οκτωβρίου: 10,
  Νοεμβρίου: 11,
  Δεκεμβρίου: 12
}

export const groupOrdersByMonth = (orders: Order[]): GroupedOrdersResult => {
  const grouped = orders.reduce<GroupedOrdersResult>(
    (acc, order) => {
      const statusBased = order.status === OrderStatus.SEND ? order.sendDate : order.takenDate
      const date = new Date(statusBased)
      const monthYear = `${date.toLocaleString('el-GR', { month: 'long' })} ${date.getFullYear()}`

      if (!acc.groupedOrders[monthYear]) {
        acc.groupedOrders[monthYear] = []
        acc.sortedMonths.push(monthYear)
      }

      acc.groupedOrders[monthYear].push(order)

      return acc
    },
    { groupedOrders: {}, sortedMonths: [] }
  )

  grouped.sortedMonths.sort((a, b) => {
    const [monthA, yearA] = a.split(' ')
    const [monthB, yearB] = b.split(' ')
    const numericMonthA = monthNamesToNumbers[monthA]
    const numericMonthB = monthNamesToNumbers[monthB]
    const dateA = new Date(parseInt(yearA), numericMonthA - 1)
    const dateB = new Date(parseInt(yearB), numericMonthB - 1)

    return dateB.getTime() - dateA.getTime()
  })

  return grouped
}
