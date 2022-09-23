import { IUser } from '~/interfaces'
import CommonService from '~/services/CommonService'

export const useUserStore = defineStore('userStore', () => {
  const users = ref<IUser[]>([])

  const getUsers = async () => {
    const response = await CommonService.getUsers()
    users.value = response.data.users
  }

  return {
    users,
    getUsers
  }
})
