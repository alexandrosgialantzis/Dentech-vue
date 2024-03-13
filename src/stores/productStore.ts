import { Product, ProductsResponse } from './../types/interfaces'
import { defineStore } from 'pinia'
import { ProductState } from '../types/interfaces'
import { productHttp } from '../services/productHttp'

export const useProductStore = defineStore('productStore', {
  state: (): ProductState => ({
    products: null,
    loading: false,
    isFetched: false,
    error: false
  }),

  actions: {
    async fetchProducts(search?: string) {
      this.loading = true
      try {
        const res = await productHttp.get<ProductsResponse<Product>>(
          `/get-products${search ? `?searchString=${search}` : ''}`
        )
        this.products = res.data.products
        this.isFetched = true
      } catch (e) {
        this.error = true
      } finally {
        this.loading = false
      }
    }
  },

  getters: {
    getProducts: (state) => state.products
  }
})
