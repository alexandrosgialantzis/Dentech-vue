import axios from 'axios'

const API_URL = 'https://dentech-api.onrender.com/api/v1/auth'

export const authHttp = axios.create({
  baseURL: API_URL,
  withCredentials: true
})
