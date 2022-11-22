import { IChangePassword, IUpdateInfo, IUser, Nullable } from '~/interfaces'
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

    const register = async (username: string, password: string) => {
      const response = await CommonService.register(username, password)
      token.value = response.data.token
    }

    const getCurrentUser = async () => {
      const response = await CommonService.getCurrentUser()
      currentUser.value = response.data.data
    }

    const changePassword = (changePasswordInfo: IChangePassword) => {
      return CommonService.changePassword(changePasswordInfo)
    }

    const updateInfo = async (updateInfo: IUpdateInfo) => {
      const response = await CommonService.updateInfo(updateInfo)
      currentUser.value = response.data.data
    }

    const logout = () => {
      token.value = ''
      currentUser.value = null
    }

    return {
      token,
      currentUser,
      changePassword,
      getCurrentUser,
      login,
      logout,
      register,
      updateInfo
    }
  },
  {
    persist: {
      paths: ['token']
    }
  }
)
