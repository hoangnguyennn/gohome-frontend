import axios, { AxiosError } from 'axios'
import { message } from 'ant-design-vue'
import { IErrorResponse } from '../interfaces'
import { useAuthStore } from '../store/stores/authStore'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
})

axiosClient.interceptors.request.use((config) => {
  const authStore = useAuthStore()

  config.headers = {
    Authorization: `Bearer ${authStore.token}`
  }

  return config
})

axiosClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError<IErrorResponse>) => {
    const errorMessage = error.response?.data.message
    message.error(errorMessage)
    throw error
  }
)

export default axiosClient
