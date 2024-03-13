import { productHttp } from '../services/productHttp'
import { useToastStore } from '../stores/toastStore'
import { ToastConclusion, ToastHeader } from '../types/enums'
import { Product, ProductResponse } from '../types/interfaces'

export const useProduct = () => {
  const toast = useToastStore()

  const deleteProduct = async (id: string) => {
    try {
      const res = await productHttp.delete<ProductResponse<Product>>(`/${id}/delete-product`)
      toast.showToast(res.data.message, ToastHeader.SUCCESS, ToastConclusion.SUCCESS)
    } catch (error) {
      toast.showToast('Κάτι πήγε στραβά', ToastHeader.ERROR, ToastConclusion.ERROR)
    }
  }

  return { deleteProduct }
}
