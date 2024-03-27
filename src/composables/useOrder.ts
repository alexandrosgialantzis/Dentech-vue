import { ref } from 'vue'
import { orderHttp } from '../services/orderHttp'
import { useToastStore } from '../stores/toastStore'
import { ToastConclusion, ToastHeader } from '../types/enums'
import { GroupedOrdersResult, Order, OrderResponse } from '../types/interfaces'
import { groupOrdersByMonth } from '../utils/orders'

export const useOrder = () => {
  const toast = useToastStore()

  const orders = ref<null | GroupedOrdersResult>(null)
  const count = ref(0)
  const paying = ref(false)

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

  const deleteOrder = async (id: string) => {
    try {
      const res = await orderHttp.delete<OrderResponse<Order>>(`/${id}/delete-order`)
      toast.showToast(res.data.message, ToastHeader.SUCCESS, ToastConclusion.SUCCESS)
    } catch (error) {
      toast.showToast('Κάτι πήγε στραβά', ToastHeader.ERROR, ToastConclusion.ERROR)
    }
  }

  return { deleteOrder, orders, count, handleOrders, pay, paying }
}
