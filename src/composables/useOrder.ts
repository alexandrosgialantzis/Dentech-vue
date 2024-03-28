import { ref } from 'vue'
import { orderHttp } from '../services/orderHttp'
import { useToastStore } from '../stores/toastStore'
import { ToastConclusion, ToastHeader } from '../types/enums'
import { GroupedOrdersResult, Order, OrderResponse, ProductsOnOrder } from '../types/interfaces'
import { groupOrdersByMonth } from '../utils/orders'
import { isValidDateFormat } from '../utils/date'
import { useProductStore } from '../stores/productStore'

export const useOrder = (ord?: Order, products?: ProductsOnOrder[]) => {
  const toast = useToastStore()
  const product = useProductStore()

  const orders = ref<null | GroupedOrdersResult>(null)
  const count = ref(0)
  const paying = ref(false)
  const productsToAddIds = ref<string[]>([])
  const totalCost = ref(ord?.totalCost ?? 0)
  const paid = ref(ord?.paid ?? 0)
  const unPaid = ref(ord?.unPaid ?? 0)
  const productsToAdd = ref<ProductsOnOrder[]>(products?.length ? products : [])

  const handleUnPaid = () => {
    unPaid.value = totalCost.value - paid.value
  }

  const add = (id: string) => {
    const prod = product.products.find((prod) => prod._id === id)
    const i = productsToAdd.value.findIndex((prod) => prod.id === id)

    if (i !== -1) {
      const updatedProduct = {
        ...productsToAdd.value[i],
        amount: productsToAdd.value[i].amount + 1
      }
      productsToAdd.value = [
        ...productsToAdd.value.slice(0, i),
        updatedProduct,
        ...productsToAdd.value.slice(i + 1)
      ]
    } else {
      productsToAdd.value.push({ id, amount: 1 } as ProductsOnOrder)
      productsToAddIds.value.push(id)
      totalCost.value += prod.price
      handleUnPaid()
      return
    }

    totalCost.value += prod.price
    handleUnPaid()
  }

  const remove = (id: string) => {
    const i = productsToAdd.value.findIndex((prod) => prod.id === id)
    productsToAdd.value[i].amount -= 1

    const prod = product.products.find((prod) => prod._id === id)

    totalCost.value -= prod.price
    handleUnPaid()

    if (productsToAdd.value[i].amount <= 0) {
      productsToAdd.value.splice(i, 1)
      productsToAddIds.value = productsToAddIds.value.filter((prodId) => prodId !== id)
    }
  }

  const isValidDate = (date: string | null) => {
    if (date) {
      if (!isValidDateFormat(date)) {
        toast.showToast('Λάθος διαμόρφωση ημερομηνίας!', ToastHeader.ATT, ToastConclusion.ATT)
        return false
      }
    }
    return true
  }

  const pay = async (id: string, payment: number) => {
    try {
      paying.value = true
      const res = await orderHttp.patch<OrderResponse<Order>>(`/${id}/update-order`, {
        paid: payment
      })
      toast.showToast(res.data.message, ToastHeader.SUCCESS, ToastConclusion.SUCCESS)
      return res.data.order
    } catch (error) {
      toast.showToast('Κάτι πήγε στραβά', ToastHeader.ERROR, ToastConclusion.ERROR)
    } finally {
      paying.value = false
    }
  }

  const handleOrders = (res: Order[]) => {
    if (res.length) {
      orders.value = groupOrdersByMonth(res)
      count.value = res.length
    } else {
      orders.value = {} as GroupedOrdersResult
      count.value = res.length
    }
  }

  return {
    orders,
    count,
    handleOrders,
    pay,
    paying,
    isValidDate,
    add,
    remove,
    productsToAddIds,
    productsToAdd,
    totalCost,
    unPaid,
    paid,
    handleUnPaid
  }
}
