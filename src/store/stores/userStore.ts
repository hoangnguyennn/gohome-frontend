import { IUser } from '~/interfaces'
import CommonService from '~/services/CommonService'

export const useUserStore = defineStore('userStore', () => {
  const users = ref<IUser[]>([])

  const getUsers = async () => {
    const response = await CommonService.getUsers()
    users.value = response.data.data
  }

  const getUserById = (id: string) => {
    return CommonService.getUserById(id)
  }

  const verifyUser = (id: string) => {
    return CommonService.verifyUser(id)
  }

  return {
    users,
    getUsers,
    getUserById,
    verifyUser
  }
})
