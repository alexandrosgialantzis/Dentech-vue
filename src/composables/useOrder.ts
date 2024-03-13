import { orderHttp } from '../services/orderHttp'
import { useToastStore } from '../stores/toastStore'
import { ToastConclusion, ToastHeader } from '../types/enums'
import { Order, OrderResponse } from '../types/interfaces'

export const useOrder = () => {
  const toast = useToastStore()

  const deleteOrder = async (id: string) => {
    try {
      const res = await orderHttp.delete<OrderResponse<Order>>(`/${id}/delete-order`)
      toast.showToast(res.data.message, ToastHeader.SUCCESS, ToastConclusion.SUCCESS)
    } catch (error) {
      toast.showToast('Κάτι πήγε στραβά', ToastHeader.ERROR, ToastConclusion.ERROR)
    }
  }

  return { deleteOrder }
}
