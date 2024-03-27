import { OrderStatus, Roles } from './enums'

export interface CurrentUser {
  userId: string | null
  fullName: string | null
  email: string | null
  role: Roles | null
  cellPhone?: number | null
  telephone?: number | null
}

export interface User {
  _id: string
  fullName: string
  email: string
  role: Roles
  cellPhone?: number
  telephone?: number
}

export interface UserState {
  user: CurrentUser
  sessionChecked: boolean
  isLoading: boolean
}

export interface ProductState {
  products: Product[] | null
  loading: boolean
  isFetched: boolean
  error: boolean
}

export interface DoctorState {
  docs: User[] | null
  loading: boolean
  isFetched: boolean
  error: boolean
}

export interface MessageResponse {
  message: string
}

export interface UserResponse<T> extends MessageResponse {
  user: T
}

export interface TotalCount {
  totalCount: number
  totalDocs: number
}

export interface UsersResponse<T> extends TotalCount {
  users: T[]
}

export interface Toast {
  show: boolean
  header: string
  message: string
  conclusion: string
  duration: number
  timeoutId: NodeJS.Timeout | null
  headerColor: string
}

export interface UserPayload {
  password: string
  fullName: string
  email: string
  cellPhone?: number
  telephone?: number
  role?: Roles
}

export interface Product {
  _id: string
  price: number
  name: string
  createdBy?: User
  orders: Order[]
  updatedAt: Date
}

export interface ProductsOnOrder extends Product {
  id: string | Product
  amount: number
}

export interface Order {
  _id: string
  takenDate: Date
  sendDate?: Date
  dentist?: User
  createdBy?: User
  totalCost: number
  unPaid: number
  paid?: number
  description: string
  products: ProductsOnOrder[]
  updatedAt: Date
  numberOfOrder: string
  status: OrderStatus
  client: string
}

export interface OrdersResponse<T> extends TotalCount {
  orders: T[]
}

export interface OrderResponse<T> extends MessageResponse {
  order: T
}

export interface ProductsResponse<T> extends TotalCount {
  products: T[]
}

export interface ProductResponse<T> extends MessageResponse {
  product: T
}

export interface ProductPayload {
  name: string
  price: number
}

export interface PasswordPayload {
  oldPassword: string
  newPassword: string
}

export interface GroupedOrdersResult {
  groupedOrders: Record<string, Order[]>
  sortedMonths: string[]
}
