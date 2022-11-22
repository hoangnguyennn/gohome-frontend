import { IUser } from '~/interfaces'
import CommonService from '~/services/CommonService'
import { useDataListStore } from './dataListStore'

export const useUserStore = defineStore('userStore', () => {
  const dataListStore = useDataListStore()
  const users = ref<IUser[]>([])

  const getUsers = async (params?: any) => {
    const response = await CommonService.getUsers(params)
    users.value = response.data.data
    dataListStore.setTotal(response.data.total)
  }

  const getUserById = (id: string) => {
    return CommonService.getUserById(id)
  }

  const verifyUser = (id: string) => {
    return CommonService.verifyUser(id)
  }

  const reset = () => {
    users.value = []
    dataListStore.reset()
  }

  return {
    users,
    getUsers,
    getUserById,
    verifyUser,
    reset
  }
})
