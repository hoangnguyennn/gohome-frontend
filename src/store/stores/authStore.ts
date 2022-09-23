import { IUser, Nullable } from '~/interfaces'
import CommonService from '~/services/CommonService'

export const useAuthStore = defineStore(
  'authStore',
  () => {
    const currentUser = ref<Nullable<IUser>>(null)
    const token = ref('')

    const login = async (username: string, password: string) => {
      const response = await CommonService.login(username, password)
      token.value = response.data.token
    }

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
      login,
      getCurrentUser,
      logout
    }
  },
  {
    persist: true
  }
)
