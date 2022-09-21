import { IUser, Nullable } from '../../interfaces'
import CommonService from '../../services/CommonService'

export const useAuthStore = defineStore(
  'authStore',
  () => {
    const currentUser = ref<Nullable<IUser>>(null)
    const token = ref('')

    const getCurrentUser = async () => {
      const response = await CommonService.getCurrentUser()
      currentUser.value = response.data.user
    }

    const logout = () => {
      token.value = ''
      currentUser.value = null
    }

    return {
      token,
      currentUser,
      getCurrentUser,
      logout
    }
  },
  {
    persist: true
  }
)
